# แผนการย้าย iCubeServerFrontend ไป Next.js

## ภาพรวมโปรเจกต์ปัจจุบัน
- โค้ดเบสหลักเป็น Angular 8 (single AppModule) ใช้ RouterModule แบบรวมทุกหน้าภายใต้ `AppLayout` (หลังล็อกอิน) และ `EmptyLayout` (หน้าสาธารณะ)
- โครงสร้างส่วนติดต่อผู้ใช้แบ่งตามโดเมนฟีเจอร์ใน `src/app/components/functions/**` และคอมโพเนนต์ที่ใช้ซ้ำใน `components/share`
- ใช้ไลบรารี UI จำนวนมาก เช่น Angular Material, PrimeNG, ngx-toastr, ngx-spinner, ng2-charts, cron editor, jQuery/Bootstrap 4
- ฝั่งข้อมูลพึ่งพา client ที่สร้างจาก Swagger (`src/app/swagger-api`) และบริการเฉพาะ (`apis/sta-oauth`) พร้อม service กึ่ง stateful (`AuthenticationService`, `SignalRService`)
- ระบบยืนยันตัวตนเก็บโทเคนใน `localStorage` + cookie, guard ด้วย `AuthGuard`, refresh token อัตโนมัติ และตั้งค่าคุกกี้สำหรับข้อมูลผู้ใช้/โรงงาน
- มีการสื่อสารเรียลไทม์ผ่าน SignalR hub (`/v1/healthcheck`) เพื่อติดตามสถานะ service และ latency
- ทรัพยากร static อยู่ใน `src/assets` เช่น ไอคอนเมนู, animation, สคริปต์เสริม

## ผังข้อมูล (Site Map)
### เส้นทางสาธารณะ (EmptyLayout)
- `/login` – แบบฟอร์มเข้าสู่ระบบ
- `/forgotpassword` – ขั้นตอนเริ่มต้นรีเซ็ตรหัสผ่าน
- `/verifycode` – ป้อนรหัสยืนยันสำหรับรีเซ็ตรหัสผ่าน
- `/newpassword` – ตั้งรหัสผ่านใหม่หลังยืนยัน
- `/health` – หน้าสถานะระบบแบบสาธารณะ

### เส้นทางหลังยืนยันตัวตน (AppLayout, `AuthGuard`)
- `/register` – ลงทะเบียนผู้ใช้ใหม่
- `/overview` – หน้าแดชบอร์ดภาพรวม (ใช้กราฟหลายรูปแบบ)
- `/tag`
  - `/tag/configuration` – ตั้งค่าแท็ก/พอยท์ข้อมูล
  - `/tag/relation-configuration` – ตั้งค่าความสัมพันธ์ของแท็ก
- `/data`
  - `/data/editor` – จัดการค่า/ประวัติข้อมูล
  - `/data/relation-editor` – จัดการความสัมพันธ์ของค่า
- `/scheduling`
  - `/scheduling/configuration` – ตั้งค่า Trigger/Scheduler
  - `/scheduling/monitoring` – มอนิเตอร์งานตามเวลา
  - `/scheduling/monitoring/history/:id` – ประวัติการรันตามรายการ
- `/event/configuration` – ตั้งค่าอีเวนต์ตอบสนอง
- `/interface`
  - `/interface/configuration` – ตั้งค่าช่องทางเชื่อมต่อ
  - `/interface/mapping` – แม็พฟิลด์/สคีมา
- `/integration`
  - `/integration/provider` – จัดการผู้ให้ข้อมูล
  - `/integration/publisher` – จัดการปลายทางส่งข้อมูล
- `/system-management` – การจัดการระบบ (ค่าทั่วไป/ไฟล์ตั้งค่า)
- `/security`
  - `/security/user-management` – ผู้ใช้
  - `/security/group-management` – กลุ่ม
  - `/security/role-permission-management` – บทบาทและสิทธิ์
  - `/security/token-provider-management` – ผู้ให้โทเค็น/การกระจายสิทธิ์
- `/log`
  - `/log/application` – บันทึกแอปพลิเคชัน
  - `/log/system` – บันทึกระบบ
  - `/log/security` – บันทึกความปลอดภัย
  - `/log/error` – บันทึกข้อผิดพลาด

> เส้นทาง wildcard `**` ถูก redirect กลับ `/login`

## รายละเอียดตามเส้นทาง (UI Inventory)
### หน้า Public (EmptyLayout)
#### `/login` – `LoginComponent`
- **คอมโพเนนต์ย่อย**: `app-loading-spinner`, Angular Material `mat-dialog` สำหรับ Terms/Privacy, ปุ่ม `p-checkbox` (PrimeNG) remember me, ปุ่ม OAuth (STA/Microsoft)
- **ฟอร์มหลัก**: Reactive form `loginForm` (ฟิลด์ `username`, `password`, `rememberUser`) พร้อม toggle โชว์รหัสผ่านและ error message กำหนดเอง
- **การโต้ตอบ/ปุ่ม**: Submit login, STA OAuth (`STALogin`), Microsoft OAuth, ลิงก์ Forgot password, copy version, เปิด Terms/Privacy modal
- **โมดัล**: `DialogTermOfServiceComponent`, `DialogPrivacyPolicyComponent` (MatDialog กว้าง 500px)
- **บริการที่เรียกใช้**: `AuthenticationService.login`, `STAOAuthClientService`, โหลด permission ก่อน redirect `/overview`

#### `/forgotpassword` – `ForgotpassComponent`
- **ฟอร์ม**: `forgotpassForm` (ฟิลด์ `email` พร้อม validator และ custom error message)
- **ปุ่ม**: ส่งคำขอผ่าน `sendmail`, ปิดด้วย spinner loading เมื่อกำลังส่ง
- **UI พิเศษ**: Background responsive (mobile/desktop split), ใช้ `app-loading-spinner`

#### `/verifycode` – `VerifycodeComponent`
- **ฟอร์ม**: OTP form ด้วย `ng-otp-input` (6 หลัก), ฟิลด์ `email`
- **ปุ่ม**: ยืนยันรหัส (`verifyFormSubmit`), resend code (debounce ด้วยตัวจับเวลา), back to login
- **แจ้งเตือน**: ใช้ ngx-toastr เมื่อรหัสไม่ถูกต้องหรือหมดเวลา

#### `/newpassword` – `NewpassComponent`
- **ฟอร์ม**: `newpassForm` มี `newPassword`, `confirmPassword`, `code` พร้อม validator pattern (ต้องมีตัวใหญ่/เล็ก/ตัวเลข/อักขระพิเศษ)
- **ปุ่ม**: ตั้งรหัสผ่านใหม่, toggle show password, redirect กลับ `/login`
- **โมดัล**: ไม่มี (ใช้ toast แจ้งผล)

#### `/health` – `HealthcheckComponent`
- **การแสดงผล**: แสดงข้อมูล JSON (`appInfo`) ตรง ๆ ใน `<pre>`
- **การเชื่อมต่อ**: เรียก HealthCheckService จาก Swagger client เพื่อโหลดสถานะ (ใน TS)

### หน้า Protected (AppLayout)
#### `/register` – `RegisterComponent`
- **ฟอร์ม**: Template-driven (`ngForm`) ฟิลด์ `username/email`, `password`, `password_retry`, `position`, checkbox terms
- **การโต้ตอบ**: ตรวจสอบ password match, dropdown `positions`, ปุ่ม social sign-up placeholder

#### `/overview` – `HomeComponent`
- **คอมโพเนนต์หลัก**: Layout แบบ card แบ่ง 3 แถว ได้แก่ Factory/Server/Service info, กราฟ API/Error, Latency/Server status/Service status
- **กราฟ/วิดเจ็ต**: `app-line-chart` (หลาย instance), `p-progressBar`, สถานะ SignalR (`fa-rss` ไอคอนสีตามการเชื่อมต่อ)
- **ข้อมูล**: Factory info (name/type/node/token copy), Server info (จำนวน Tag/TagRelation/Interface/Integration/Security), Service info (Form usage), Charts สำหรับ API/Error/Latency พร้อมเชื่อม SignalR hooks
- **การโต้ตอบ**: Copy token (`copyInputMessage`), subscribe ข้อมูล realtime (`SignalRService`), ปุ่ม refresh ในกราฟ (ผ่าน output `changeValue`)

#### `/tag/configuration` – `TagConfigComponent`
- **ตารางหลัก**: PrimeNG `p-table` (`tagStructure` → `Tag name`, `Description`, `Tag source`, `Tag type`, `Tag mode`, `Eng. unit`, `Created at`), paginator ด้านล่าง, ค้นหา global ด้วย search box
- **ตัวกรอง**: search แบบ debounce (`onSearchChange`), ตัวเลือก sort (`sortOptions`)
- **ฟอร์ม/โมดัล**: `createTagModal` และ `editTagModal` (Reactive form)
  - แท็บข้อมูลพื้นฐาน: `tagName`, `description`, `subDescription`, `tagSource`, `tagType`, `tagMode`, `unit`, `decimalPoint`, `minValue`, `maxValue`, `periodValue/Unit`, `enableDuplicateCheck`
  - การเชื่อมต่อ interface: dropdown binding interface type (`InterfaceConnectionDto`), ฟอร์มย่อยสำหรับ Modbus/OPC/MQTT (fields เช่น IP, Port, NodeId, Topic)
  - Security: multi-select ผู้ใช้/กลุ่ม (`authorizeSecurityByType`), เลือกสิทธิ์อ่าน/เขียน, sync กับ Tag/Data permission
  - Alert/Condition: operator options (>, <, ==, CONTAINS ฯลฯ), value threshold, notification flag
- **ปุ่ม/แอ็กชัน**: Create, Edit (เปิดเมื่อคลิกแถว), ลบ (SweetAlert), export, copy metadata, refresh server info
- **บริการ**: `TagService`, `InterfaceService`, `OpcUaService`, `ModbusTCPService`, `ManagementService`, `SecurityService`

#### `/tag/relation-configuration` – `TagGroupConfigComponent`
- **ตารางหลัก**: `tagGroupStructure` (`TagRelation name`, `Description`, `Table type`, `Data type`, `Field count`, `Created at`)
- **ตัวกรอง**: search, sort (AZ/ZA/Newest/Oldest), toggle table/view mode
- **โมดัล**: สร้าง/แก้ไข TagRelation มีขั้นตอน
  - กำหนด schema (`tagRelationPropertiesStructure`: `Name`, `Data Type`, `Not NULL`, `Identity`), validation คำห้าม (id, timestamp)
  - ตั้งค่า view/hyper table, mapping ระหว่าง identity กับฟิลด์
  - Security permission แยก Tag/Data
  - Dynamic table preview (`dynamicTagRelationStructure`: `Column`, `Time Stamp`, `Quality`, `Status`)
- **แอ็กชัน**: เพิ่ม/แก้ไข/ลบ field, import/export CSV, sync กับ TagRelationValueService

#### `/data/editor` – `ValueEditorComponent`
- **เลย์เอาต์สองคอลัมน์**: ซ้ายเป็นรายการ Tag (ตาราง `tagStructure`: `Tagname`, `Description`, `Tag type`), ขวาแสดง Historical value (`tagValueStructure`: `Value`, `Time Stamp`, `Quality`, `Status`)
- **ตัวกรอง/ควบคุม**: search Tag, time range (`startTime`, `endTime` ปรับได้ทั้ง epoch และ datetime picker), sort (TOP/LAST), limit (dropdown), filter ตาม `Quality`/`Status`, refresh auto timer
- **โมดัล**:
  - `addValueModal`: เพิ่มค่ามีฟิลด์ Value, Timestamp, Quality, Status; รองรับ upload CSV (preview, invalid rows)
  - `editValueModal`: แก้ไขค่าเดี่ยว
  - `deleteValueModal`, `deleteValueAllModal`: ลบค่าที่เลือกหรือทั้งหมดในช่วง
- **แอ็กชัน**: Export Excel/CSV, download sample CSV, Append vs Replace mode, validate timestamp format
- **บริการ**: `TagValueService`, `SecurityService`, `AuthService`, `ToastrService`, `NgxSpinner`

#### `/data/relation-editor` – `ValueGroupEditorComponent`
- **ตาราง TagRelation**: `tagGroupStructure` (`TagRelation name`, `Description`, `Table type`, `Data type`, `Field count`, `Created at`)
- **มุมมองข้อมูล**: Dynamic columns (`dynamicTagRelationStructure` → column metadata + `Time Stamp`, `Quality`, `Status`), toggle Hyper table / view mode, filter ตามคีย์ identity
- **ควบคุมเวลา/การโหลด**: เลือก Limit, sort (TOP/LAST), time range, preview sample
- **โมดัล**: เพิ่ม/แก้ไขค่า relation (dynamic form ตาม schema), upload CSV (validate header ตรง schema), delete record (เดี่ยว/ทั้งหมด)
- **Mapping**: ตั้งค่า mapping กับ interface (field mapping, timestamp mapping, scheduling integration)

#### `/scheduling/configuration` – `SchedulingConfigComponent`
- **ตาราง Scheduler**: `schedulerStructure` (`Scheduler name`, `Description`, `Cron expression`, `Describe expression`) พร้อม search, paginator
- **ฟอร์ม**: `schedulerForm` (ชื่อ, คำอธิบาย, cron expression, expression แบบ natural language, toggle enabled), cron editor (`cron-editor`), period settings, trigger action mapping
- **โมดัล**: สร้าง/แก้ไข scheduler, ผูก user/role (ใช้รายการ `userStructure`), preview/result ของ cron expression
- **บริการ**: `SchedulerService`, `cron-converter-u2q`, `cron-expression-validator`, `cronstrue`

#### `/scheduling/monitoring` – `SchedulingMonitoringComponent`
- **ตาราง nested**: `colsSchedulerMonitoring` (หัวคอลัมน์ เช่น `Scheduling name`, `Trigger`, `Latest status`, `Last run`, `Next run`, `Action`, `Enabled`)
- **UI**: Subrow ชื่อ scheduling + ปุ่ม Pause/Resume all, แถวลูกต่อ trigger แสดงสถานะ step (ingression/read/load), icon สีตาม `latestProcessStatusId`
- **ตัวกรอง**: search box,ปุ่ม Query refresh, paginator, column resize
- **โมดัล**: `schedulingProcessModal` แสดง timeline สีตามสถานะ (Steps 1-4) และตารางประวัติ, ปุ่ม view history (navigate `/scheduling/monitoring/history/:id`)

#### `/scheduling/monitoring/history/:id` – `SchedulingHistoryComponent`
- **แผงประวัติ**: ตารางรายการ run พร้อมคอลัมน์เวลาเริ่ม/จบ, status per step, duration, error message, ปุ่ม download log
- **ตัวกรอง**: Date range, keyword
- **โมดัล**: รายละเอียดแต่ละ process (schema คล้าย monitoring modal)

#### `/event/configuration` – `EventConfigComponent`
- **ตาราง**: `eventStructure` (`Event Name`, `Description`, `Event type`) พร้อม search debounce และ paginator
- **ฟอร์ม/โมดัล**: ใช้ `EventEditorModalComponent` ผ่าน `ModalService`
  - ข้อมูลพื้นฐาน: ชื่ออีเวนต์, คำอธิบาย, ประเภท (เช่น Tag trigger, Scheduler)
  - การระบุ Trigger/Action: เลือก Tag/TagRelation, ตั้งค่าเงื่อนไข, Action (เช่น ส่ง notification, call integration)
  - Permission และ limit: ตรวจสอบ quota ผ่าน `ManagementService.getLimitInformationByServiceName`
- **การโต้ตอบ**: Create/Edit/Delete ผ่าน modal, search realtime, แจ้งผลผ่าน ngx-toastr

#### `/interface/configuration` – `InterfaceConfigComponent`
- **ตาราง**: `interfaceStructure` (`Interface name`, `Description`, `Interface type`, `Status`) แสดง icon/type, slide toggle แสดงสถานะ
- **ฟิลเตอร์**: search box, pagination, sort
- **โมดัล**: `createInterfaceModal`, `editInterfaceModal`
  - ฟิลด์หลัก: `interfaceName`, `interfaceDescription`, `interfaceType`, `status`
  - Form ย่อยตามประเภท (iCube/MQTT/MSSQL/Oracle/SharePoint/File System/REST API/PGSQL): host, port, credential, SSL, polling interval, authentication mode, topic
  - Validation เฉพาะ เช่น REST API auth header, SQL connection string, file path, SharePoint credential
- **บริการ**: `InterfaceService`, `OpcUaService`, `ModbusTCPService`, `SharePointService`, `FileSystemService`, `RestApiService`

#### `/interface/mapping` – `InterfaceMappingComponent`
- **เลย์เอาต์**: Side panel เลือก Interface (list + detail), รายการ Mapping (`mappingList`) พร้อม paginator/search
- **ฟอร์ม Mapping**: `mappingForm` ครอบคลุม
  - ข้อมูลพื้นฐาน: `mappingName`, `description`, `interfaceId`, `status`
  - Source configuration: อ่านจาก Database/File/API (table name, query mode, file path, delimiter, sheet name, header row)
  - Timestamp mapping: เลือก column/format, โหมด Merge, clear start/end
  - Target mapping: เลือก Tag/TagRelation, กำหนด field mapping dynamic (`TableColumn`), กำหนด Value status
  - Scheduling: เลือก scheduler, period value/unit, enable/disable
  - Testing tools: ปุ่ม Evaluate (Modbus/OPCUA/MQTT), preview sample, save template
- **โมดัล/ไดอะล็อก**: SweetAlert confirm delete, dynamic modal สำหรับ test connection, upload file selector
- **บริการ**: `MappingService`, `SchedulerService`, `TagService`, `TagRelationService`, `IntegrationService` และบริการเฉพาะ interface (MSSQL, Oracle, RestAPI ฯลฯ)

#### `/integration/provider` – `ProviderComponent`
- **สวิตช์มุมมอง**: Toggle ระหว่าง Tag กับ TagRelation provider (`showTag`)
- **ตาราง**:
  - Tag API (`integrationStructure`: `Tag Name`, `URL`, `Status`) พร้อม slide toggle เปิด/ปิด, copy URL, paginator
  - TagRelation API (`integrationStructureTagRelation`: `TagRelation Name`, `URL`, `Status`)
- **ฟิลเตอร์**: search box, sort options (AZ/ZA/Newest/Oldest), filter สถานะ
- **โมดัล**: สร้าง/แก้ไข provider (ฟิลด์ URL template, auth header, payload, security), ดูรายละเอียด request sample

#### `/integration/publisher` – `PublisherComponent`
- **ตาราง**: PrimeNG `p-table` (`publisherStructure`: `Publisher name`, `Description`, `Interface type`, `Status`) พร้อม paginator และ sort
- **ฟอร์ม**: `publisherForm` ครอบคลุม
  - ข้อมูลพื้นฐาน (ชื่อ, description, เปิด/ปิด status)
  - เลือก interface (ดึงมาจาก `interfaceList`) พร้อมปุ่ม `checkInterfaceConnectionAndData`
  - โหมด query สำหรับ iCube interface (Time Range + start/end time)
  - การกำหนด Target: เลือก Tag/TagRelation, จัดการ mapping (`PublisherCreateTagItem`, `PublisherCreateDynamicValueItem`), ระบุ Value status, Merge/Clear mode
  - Scheduling: เลือก scheduler (`schedulingList`), period value/unit, validate mode (Insert / Insert & Clear)
  - Authentication: ตัวเลือก `None/Basic/Bearer`, ฟิลด์ credential ตามประเภท
- **โมดัล**: `createPublisherModal`, `editPublisherModal`, dialog ทดสอบ (`ICubeTestInsert*`), SweetAlert สำหรับลบ
- **การโต้ตอบ**: ทดสอบ insert/tag relation, toggle status, copy URL จาก interface, preview data ก่อนบันทึก

#### `/system-management` – `ManagementComponent`
- **หมายเหตุ**: โครงร่าง card placeholder (Factory/Tags/Alarms/Data/Network) ยังไม่ผูกข้อมูลใน HTML
- **โอกาสพอร์ต**: สามารถออกแบบใหม่ให้เป็น System dashboard หรืออาจถูกย้ายเข้าส่วนอื่น

#### `/security/user-management` – `UserGroupComponent`
- **ตาราง**: `userStructure` (`Username`, `Description`, `Role`, `iCube Server`, `iCube Form`) แสดงสถานะ Active/Inactive ด้วย icon สี, paginator + search + sort
- **โมดัล**: `createUserModal`, `editUserModal`
  - ฟิลด์: `username` (อีเมล), `description`, `password`, `confirmPassword`, `roleId`, สิทธิ์ `canAccessServer`, `canAccessForm` (monitoring ถูกคอมเมนต์ไว้), binding กับ `roleEditList`
  - Validation: password pattern, confirm match, จำกัดความยาวคำอธิบาย 100 ตัวอักษร
- **แอ็กชัน**: เปิด/ปิดสิทธิ์การเข้าถึง, บันทึก/ลบผู้ใช้, โหลดข้อมูลผู้ใช้ผ่าน `SecurityService`

#### `/security/group-management` – `GroupComponent`
- **ตาราง**: รายชื่อ group (ชื่อ, Description, จำนวนสมาชิก, สิทธิ์)
- **โมดัล**: เพิ่ม/แก้ไขกลุ่ม, เพิ่มสมาชิก (`users` multi-select), assign permissions, ฟิลเตอร์สมาชิก, ลบสมาชิกเดี่ยว

#### `/security/role-permission-management` – `RolePermissionComponent`
- **ตาราง**: role list (Role name, Description, Assigned users)
- **ฟอร์ม**: Permission matrix (checkbox per `ServiceFunctionEnum`: read/write/modify/delete), UI แยกหมวด (Tag/Data/Interface/Integration/Scheduling/Log)
- **โมดัล**: Duplicate role, assign user, delete confirm

#### `/security/token-provider-management` – `TokenProviderComponent`
- **ตาราง**: รายการ token provider (ชื่อ, ประเภท, expiration, scope, status)
- **ฟอร์ม**: สร้าง token (เลือก provider type, callback URL, grant type, scope list, expiration days), แสดง clientId/clientSecret หลังสร้าง
- **การโต้ตอบ**: ปุ่ม regenerate, revoke, copy secret

#### `/log/application` – `AppLogComponent`
- **ตาราง**: PrimeNG `p-table` รองรับ expandable rows (สำหรับ admin), คอลัมน์ตามสิทธิ์ (`colsAdmin`/`colsSuperAdmin`)
  - Admin: `Timestamp`, `Level`, `Message`, `Service`, `Username`
  - SuperAdmin เพิ่ม `Action Name`, `Event Name`, `Request Path`, `Environment`, `ClientIp`
- **ฟิลเตอร์**: keyword search, limit (`200`–`10000`), date range (`owl-date-time`), multi-select per column, calendar filter, level color coding
- **ปุ่ม**: Refresh (spinner icon), auto-refresh toggle, export CSV (เฉพาะบาง role)
- **บริการ**: `HealthCheckService`, `AuthService`, `SecurityService`, ใช้ interval polling

#### `/log/system` – `SysLogComponent`
- **คอลัมน์**: รูปแบบเดียวกับ AppLog (`Timestamp`, `Level`, `Message`, `Service`, `User Name`) และสลับเป็นชุด SuperAdmin เพื่อดู Action/Event/Request Path เพิ่มเติม
- **ฟิลเตอร์**: keyword, limit, date range, ตัวกรองรายคอลัมน์ (multi-select / calendar) เหมือน AppLog
- **ปุ่ม**: Refresh, auto-refresh, export (ถ้า role รองรับ)

#### `/log/security` – `SecLogComponent`
- **คอลัมน์**: ใช้ layout เดียวกับ SysLog/AppLog โดยเน้นเหตุการณ์ด้าน security (`Level`, `Message`, `User Name`, `Service`, metadata เพิ่มเติมสำหรับ SuperAdmin)
- **ฟิลเตอร์**: keyword, limit, date range, ตัวกรองรายคอลัมน์, calendar filter
- **การโต้ตอบ**: Refresh, auto-refresh, export ตามสิทธิ์

#### `/log/error` – `ErrLogComponent`
- **คอลัมน์**: ข้อมูล error log เหมือน Security/System (Timestamp, Level, Message, Service, User Name + metadata), ใช้สีระดับความสำคัญแบบเดียวกัน
- **ฟิลเตอร์**: keyword, limit, date range, multi-select ต่อคอลัมน์, calendar
- **การโต้ตอบ**: Refresh, auto-refresh, export (ตามสิทธิ์), แสดงรายละเอียดเพิ่มเติมใน column message

## ประเด็นสำคัญสำหรับการย้ายไป Next.js + shadcn/ui
- ต้องแทนที่ระบบ routing/guard แบบ Angular ด้วย App Router + Middleware/BFF และ client-side protection (เช่น React Hook Form + Zod สำหรับฟอร์ม, Zustand/TanStack Query สำหรับ state)
- UI เดิมใช้ CSS/Bootstrap/PrimeNG จำนวนมาก ต้องวางแผน mapping ไปยังคอมโพเนนต์ shadcn/ui, Tailwind utilities และคอมโพเนนต์ custom โดยเฉพาะ sidebar menu, data table, modal, toast
- กราฟและรีพอร์ตต้องเลือกไลบรารี React (เช่น `react-chartjs-2`, `@tanstack/react-table`, `visx`) หรือ wrapper เทียบเท่า ng2-charts/PrimeNG
- การเรียก API ปัจจุบันใช้ service/Observable + HttpInterceptor; ควรออกแบบเลเยอร์ fetch ใหม่ (เช่น OpenAPI client ผ่าน `openapi-typescript` หรือใช้ fetch + schema validation)
- การจัดเก็บโทเคน/refresh ต้องโยกไปยังโซลูชันที่ปลอดภัยกว่า (Cookie HttpOnly + Next.js Route Handler สำหรับ refresh) และจัดการ permission map ที่โหลดหลังล็อกอิน
- SignalR จำเป็นต้องมี wrapper ฝั่ง React (ใช้ `@microsoft/signalr` ใน client) และแยก lifecycle hook ให้เหมาะกับ Next.js (เช่น custom hook + context)
- สินทรัพยร์ static ต้องย้ายเข้า `public/` ใน Next.js และกำหนดแนวทาง import ไฟล์ SVG/ภาพให้ทำงานกับ bundler
- ต้องกำหนดมาตรฐาน lint/test ใหม่ (ESLint, Jest, Playwright) แทน TSLint/Karma/Protractor เดิม

## Task Breakdown สำหรับการย้าย
### ระยะที่ 0 – เตรียมความพร้อม
1. รวบรวม requirement UX/UI เพิ่มเติมและยืนยันขอบเขตกับทีม (รอชุดดีไซน์จาก shadcn/ui ที่กำลังจัดซื้อ)
2. สำรวจ API ปัจจุบัน (Swagger spec, OAuth/STA flow, SignalR endpoints) และกำหนดว่าจะสร้าง BFF หรือเรียกตรง
3. วางแผน data contract/permission matrix ที่ต้องใช้ซ้ำทุกหน้า และตรวจสอบความครบถ้วนของ environment variables

### ระยะที่ 1 – สร้างโครง Next.js
1. Bootstrap โปรเจกต์ Next.js (แนะนำ Next 14 App Router, TypeScript, ESLint, Prettier)
2. ตั้งค่า Tailwind CSS + shadcn/ui ตามดีไซน์ที่จะได้รับ กำหนด design tokens (สี, spacing, typography)
3. กำหนด alias ให้เทียบกับ Angular (`@app`, `@components`, `@lib`) เพื่อง่ายต่อการพอร์ตไฟล์
4. ติดตั้งเครื่องมือพื้นฐาน (React Hook Form, Zod, TanStack Query, Axios/Fetch wrapper, Zustand ถ้าจำเป็น)

### ระยะที่ 2 – Layout & Shell
1. ออกแบบ `app/(public)/layout.tsx` และ `app/(app)/layout.tsx` เพื่อเทียบกับ `EmptyLayout` และ `AppLayout`
2. พอร์ต Header/Menu/Footer ไปเป็นคอมโพเนนต์ React โดยใช้ shadcn/ui + Tailwind (รวม responsive + active route state)
3. ย้าย assets ที่ใช้ใน layout/เมนูไป `public/` และอัปเดตให้ใช้ `next/image` หรือ SVG inline

### ระยะที่ 3 – ระบบยืนยันตัวตน
1. ออกแบบ flow Login/Register/Forgot password ให้สอดคล้องกับ API ปัจจุบัน (เพิ่มหน้ากลาง `verifycode`, `newpassword`)
2. สร้าง Route Handler (`app/api/auth/*`) สำหรับ login/refresh/logout เพื่อซ่อน secret และจัดการ HttpOnly cookie
3. พอร์ต permission map + guard เป็น hook/context (`usePermissions`, `ProtectedRoute` component) และ middleware ตรวจ path
4. ตัดสินใจวิธีเก็บ `STAId` และอินทิเกรต STA OAuth/ MSAL ถ้ายังต้องใช้ (อาจต้องสร้างหน้า callback เพิ่ม)

### ระยะที่ 4 – เลเยอร์ข้อมูล & Utilities
1. นำ Swagger spec มาสร้าง OpenAPI client สำหรับ Next.js (ผ่าน `openapi-typescript` หรือ `swagger-typescript-api`)
2. ย้าย service สำคัญ (AuthService, SecurityService, Scheduling ฯลฯ) เป็นฟังก์ชันใน `lib/api/` พร้อม hook (`useQuery/useMutation`)
3. พอร์ตตัวช่วย เช่น form error handler, modal service, cookie helper ให้เป็น utility TypeScript/React-friendly
4. ออกแบบระบบ Toast/Notification ใหม่ (ใช้ shadcn/ui toast หรือ sonner) แทน ngx-toastr

### ระยะที่ 5 – พอร์ตฟีเจอร์หลักตามโมดูล
1. **Overview**: พอร์ตแดชบอร์ด/chart ทั้งหมด เลือกไลบรารี React สำหรับกราฟแบบ realtime & streaming
2. **Tag**: ฟอร์ม config + relation (tree, multiselect, drag & drop) → ใช้ react-hook-form + shadcn components + React DnD
3. **Data**: ตารางแก้ไขค่า/สัมพันธ์ (pagination, filter, import/export CSV/XLSX)
4. **Scheduling & Event**: Form Cron editor, monitoring table, history modal → เลือก React cron editor หรือสร้าง custom
5. **Interface & Integration**: ฟอร์มหลายขั้นตอน, mapping UI (tree/table) → ออกแบบด้วย component ที่รองรับ complex form
6. **System Management**: สรุปว่ามีอะไรใน Angular ปัจจุบัน (ตรวจสอบเพิ่มเติม) แล้วพอร์ต
7. **Security**: ตาราง user/group/role/token พร้อม modal/permission matrix → ใช้ data table + dialog shadcn/ui
8. **Log**: ตาราง log แยก 4 ประเภท + filter, download
9. จัดทำ breadcrumbs, title metadata, และ state caching ต่อหน้า

### ระยะที่ 6 – Real-time & Background Tasks
1. สร้าง hook `useSignalR` เชื่อมกับ hub `/v1/healthcheck`, จัดการ reconnect/backoff ใน React
2. พอร์ต event emitter logic เป็น `EventSource` หรือ state manager แล้วกระจายให้หน้า Overview/Monitoring ใช้
3. พิจารณา server action หรือ Edge runtime ถ้าอยากย้าย ping/healthcheck ไปฝั่ง server

### ระยะที่ 7 – Visualization & UX Enhancement
1. เลือกและคอนฟิกไลบรารีกราฟที่รองรับ streaming + theme ปรับสีให้เข้ากับ shadcn/ui
2. อัปเดตส่วนประกอบเชิงโต้ตอบ (drag-drop, tree view, multiselect) ให้เข้ากับ Experience ใหม่
3. ทบทวน accessibility (focus trap, keyboard nav) ที่ของเดิมยังไม่รองรับ

### ระยะที่ 8 – ทดสอบ & ตรวจสอบคุณภาพ
1. ตั้งค่า unit test (Jest/Testing Library) และ E2E (Playwright) พร้อม test plan ต่อโมดูล
2. สร้าง lint rule/CI pipeline เทียบกับของเดิม (แทน TSLint/Karma/Protractor)
3. ตรวจสอบ performance (Lighthouse, Web Vitals) และ security (auth flow, CSRF, XSS)

### ระยะที่ 9 – เปิดใช้งาน & ปรับแต่งหลังย้าย
1. เตรียมเอกสาร deploy (Dockerfile/CI) สำหรับ Next.js, ตรวจสอบการทำงานร่วมกับ backend เดิม
2. จัดทำคู่มือใช้งาน UI ใหม่ + changelog สำหรับผู้ใช้
3. เก็บ feedback post-migration และวางแผน iteration ต่อไป (เช่น refactor module ที่ซับซ้อน, ปรับ permission)

## ประเด็นค้างคา/การพึ่งพา
- รอชุดดีไซน์/ธีมจาก shadcn/ui เพื่อยืนยันโทนสีและคอมโพเนนต์สำคัญ
- ต้องร่วมทีม backend เพื่อตรวจสอบ API/SignalR compatibility กับ Next.js (CORS, cookie, refresh token)
- ตรวจสอบการเข้ารหัส/เก็บ key ต่าง ๆ ที่ปัจจุบันว่างอยู่ใน `environment.ts` เพื่อเตรียม `.env` ของ Next.js

เมื่อมีชุดดีไซน์และอนุมัติแผนงานแล้วสามารถเริ่มระยะที่ 1 ต่อได้ทันที

## แนวทาง Next.js + shadcn/ui (โปรเจ็กต์ใหม่)

### โครงสร้างธีม Shadcn UI Kit Dashboard (ที่ `/Users/vysina/spic_workspace/shadcn-ui-kit-dashboard`)
- ใช้ Next.js 15 + React 19 + App Router (`app/` directory) พร้อม route group `(guest)`/`(auth)` (ดู `app/dashboard/(guest)/layout.tsx` และ `app/dashboard/(auth)/layout.tsx`) เพื่อแยกเลย์เอาต์ก่อนและหลังล็อกอิน
- `RootLayout` (`app/layout.tsx`) ครอบด้วย `ThemeProvider` (จาก `next-themes`), `ActiveThemeProvider`, `NextTopLoader` และ `Toaster` (Sonner) พร้อมอ่านค่าจาก cookie เพื่อเซ็ต preset/radius/scale/content layout
- ระบบธีมกำหนดผ่าน CSS variable ใน `app/globals.css` + `app/themes.css` รวม preset ต่าง ๆ (เช่น `underground`, `rose-garden`) และ variant dark/light โดยเชื่อมกับ cookie `theme_*`
- ฟอนต์จัดการใน `lib/fonts.ts` รวม Google Fonts หลายชุดแล้วรวม class เป็น `fontVariables`; ต้องเรียก `cn` จาก `lib/utils.ts` เพื่อผสาน className เสมอ
- คอมโพเนนต์ฐาน (Radix + shadcn) อยู่ใน `components/ui/**` แยกเป็น primitive (`button`, `card`, `dialog`, `sidebar` ฯลฯ) และ custom extension (`components/ui/custom/**`, `components/custom-date-range-picker.tsx`)
- เลย์เอาต์หลักประกอบด้วย `components/layout/sidebar/**`, `components/layout/header/**`, `components/layout/logo.tsx` ซึ่งอิง hook `useSidebar()` จาก `components/ui/sidebar.tsx` สำหรับสถานะเปิด/ปิดและเชื่อม cookie `sidebar_state`
- Hook util อยู่ใน `hooks/**` (เช่น `use-mobile.ts`, `use-toast.ts`, `use-file-upload.ts`) และ utility เสริมใน `lib/**` (`themes.ts`, `utils.ts`, `ga.ts`)
- `components/theme-customizer/**` ใช้ dropdown panel (`ThemeCustomizerPanel`) เปิดให้ผู้ใช้สลับ preset, radius, color mode, layout และ reset โดยยิงค่าเข้า `ActiveThemeProvider`
- กำหนด path alias ผ่าน `tsconfig.json` (`@/*`) และมี middleware (`middleware.ts`) ที่ redirect `/` → `/dashboard/default`
- Dependencies สำคัญ: Radix UI, Sonner toast, `next-themes`, `tailwindcss-animate`, `@tanstack/react-table`, TipTap, FullCalendar, DnD kit, Zustand (พร้อมสำหรับ state management)

### แผนการตั้งค่า Next.js + shadcn/ui ให้พร้อมสำหรับ Migration
- เตรียมฐาน Next.js: ใช้ `create-next-app@latest` (เลือก App Router, TypeScript, ESLint, Tailwind) ให้ Node >= 20 ตาม `README.md` ของธีม จากนั้นคอนฟิก `tsconfig` ให้รองรับ `moduleResolution: "bundler"` และ alias `@/*`
- รวมไฟล์ธีมหลัก: คัดลอก `app/layout.tsx`, `app/globals.css`, `app/themes.css`, `components/theme-customizer/**`, `components/ui/**`, `components/layout/**`, `lib/fonts.ts`, `lib/themes.ts`, `components/active-theme.tsx`, `components/custom-date-range-picker.tsx`, `hooks/use-mobile.ts`, `hooks/use-toast.ts`
- ปรับ Tailwind 4: ตรวจสอบ `tailwind.config` ให้เปิด `@import "tailwindcss";` ตามสไตล์ใหม่ พร้อม `@plugin "tailwindcss-animate";` และ custom variant ตามไฟล์ต้นฉบับ
- ติดตั้ง dependency เพิ่มจากธีม (Radix, Sonner, lucide-react, next-themes, nextjs-toploader, tailwind-merge, class-variance-authority, date-fns, zod, react-hook-form, zustand ฯลฯ) แล้ว sync lockfile ของโปรเจ็กต์ใหม่
- เซ็ต middleware/metadata: เพิ่ม `middleware.ts` สำหรับ redirect และเตรียม utility `generateMeta` (`lib/utils.ts`) เพื่อใช้สร้าง metadata ต่อหน้า
- จัดโครงสร้าง `components/` ในโปรเจ็กต์ใหม่ให้รองรับหมวดต่อไป: `components/ui` (ฐานจาก shadcn), `components/layout` (shell), `components/shared` (wrapper ที่สร้างเอง), `components/features/<domain>` (แต่ละโมดูล Angular เดิม)
- ตรวจสอบการใช้งาน cookie: ตั้งค่า `ActiveThemeProvider` ให้รองรับ SSR (`cookies()` ใน layout), ปรับคอนฟิก Next.js `app/api/auth/...` หรือ `middleware` เพื่อจัดการ auth cookie คู่กับธีม cookie
- วางระบบ lint/format: นำ `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss` ตามธีมและเพิ่ม rule เฉพาะองค์กร (เช่น ห้ามใช้ `any`, จัดลำดับ import)

### แผน App Routing (แทน Angular Router)
- Layout หลักสองชุด:
  - `app/(public)/layout.tsx` → โครงร่างเทียบ `EmptyLayout`: กำหนด BG กลาง, ไม่มี sidebar header, ใช้สำหรับ `/login`, `/forgot-password`, `/verify-code`, `/new-password`, `/health`
  - `app/(app)/layout.tsx` → ใช้ shell จาก `AppSidebar` + `SiteHeader` (อ้างอิง `app/dashboard/(auth)/layout.tsx`) เพื่อแทน `AppLayout`
- Route group เพิ่มเติมเพื่อแยก concern: `(auth)` สำหรับหน้าหลังล็อกอินทั้งหมด, `(guest)` สำหรับ flow ก่อนล็อกอิน; สามารถแชร์ component ระหว่างกลุ่มผ่าน `src/components` ได้
- จัดโครงสร้าง path เพื่อสอดคล้องกับ sitemap เดิม โดยใช้ folder ซ้อน เช่น `app/(app)/tag/configuration/page.tsx`, `app/(app)/tag/relation-configuration/page.tsx`; สำหรับ dynamic route ใช้ `[id]`/`[...slug]`
- ใช้ `route.ts` + Server Actions สำหรับ API proxy ใกล้ UI (เช่น login, refresh token), ส่วนที่ต้องใช้ redirect ใช้ `redirect()` จาก server component
- รองรับ guard/permission ผ่าน middleware + server action:
  - Middleware ตรวจสอบ token (cookie) และ redirect ไป `/login` เมื่อไม่มีสิทธิ์
  - ในแต่ละ route กลุ่ม authenticated ดึงข้อมูลผู้ใช้ผ่าน `headers().get("x-user-permissions")` หรือเรียก API ใน `layout` แล้วส่งผ่าน context/provider
- เพิ่ม `loading.tsx` และ `error.tsx` ต่อโมดูลสำคัญเพื่อเลียนแบบ UX spinner/dialog ของ Angular เดิม

### แผนแบ่งส่วนคอมโพเนนต์และการใช้ซ้ำ
- **UI Primitives**: ใช้ตรงจาก `components/ui/**` (button, table, dialog, sidebar) หลีกเลี่ยงการแก้ไฟล์ต้นฉบับ; ถ้าต้องปรับให้ห่อเป็น component ใหม่ใน `components/shared`
- **Layout Shell**: นำ `AppSidebar`, `NavMain`, `NavUser`, `SiteHeader`, `ThemeCustomizerPanel` เป็นฐาน; สร้าง adapter สำหรับเมนูจริง (map จาก config Angular → JSON menu) และจัดการแสดงผลตาม permission
- **Form Utilities**: รวม `react-hook-form` + `zod` สำหรับ validation, ใช้คอมโพเนนต์อย่าง `Form`, `Input`, `Select`, `Calendar`, `DatePicker`; สำหรับ dynamic form (ตัวเลือก interface, mapping) ควรสร้าง abstraction (เช่น `FormSection`, `ActionBar`)
- **Data Display**: ใช้ `Table`, `Badge`, `Tabs`, `Card`, `Chart` (ถ้าต้องใช้ Recharts/Victory) แล้วห่อด้วย hook ที่จัดการ fetch/cache (React Query/Zustand)
- **Modal/Dialog**: ใช้ `Dialog`, `Drawer`, `Sheet` จาก shadcn; สำหรับ confirm action แทน SweetAlert ด้วย `AlertDialog`
- **Toast & Loading**: ใช้ `sonner` สำหรับ toast, `Spinner` component สำหรับ loading states, และ `Skeleton` สำหรับ placeholder table/grid
- **Context/State**: ใช้ Zustand หรือ React Context สำหรับ state กึ่ง global (sidebar, theme preset, user session, permission matrix), และ TanStack Table สำหรับตารางพร้อม pagination/filter
- **Domain Component แบ่งชั้น**:
  - `components/features/auth` (login forms, forgot password, OTP, new password)
  - `components/features/security` (user/group/role management table + modal)
  - `components/features/scheduling`, `components/features/integration` ฯลฯ ให้แยกตามโมดูล Angular เพื่อควบคุมการเติบโตของโค้ด

### Task List สำหรับ Migration (เริ่ม Login/Permission ก่อน)
1. **เตรียมฐานโค้ด Next.js + shadcn**
   - ตั้ง repo Next.js ใหม่, ย้ายไฟล์ธีม, ตรวจสอบ build/dev ได้
   - สร้างโครงสร้างโฟลเดอร์ `app/(public)` และ `app/(app)` พร้อม layout shell
2. **Phase 1: Public/Auth Bootstrap**
   - พอร์ตหน้า `/login` ด้วยคอมโพเนนต์จาก `app/dashboard/(guest)/login/v2/page.tsx` เป็นฐาน แล้วเชื่อม API จริง (`POST /oauth/token`), รองรับ remember me และ error toast
   - สร้าง flows `/forgot-password`, `/verifycode`, `/newpassword` โดยใช้ form component + server action เรียก API Angular เดิม (ผ่าน BFF route)
   - จัดการสถานะ session: สร้าง `lib/auth/session.ts` จัดการ cookie/token, refresh token, เก็บ factory/user info
3. **Phase 1.5: Permission Seed**
   - ดึง role/permission matrix หลังล็อกอินผ่าน API, map สู่โครงสร้างเช่น `{ resource: string; actions: string[] }`
   - สร้าง `AuthContext` หรือ Zustand store สำหรับเก็บ user + permission, พร้อม hook `usePermission("resource.action")`
   - ปรับ middleware ให้ redirect ตาม role (เช่น ไม่มี `overview.view` ให้ส่งไปหน้าอื่น)
4. **Phase 2: Authenticated Shell**
   - ย้าย sidebar/header ของธีมมาปรับเมนูจริง (map จาก sitemap Angular), ใช้ permission filter ซ่อนเมนูไม่ได้รับสิทธิ์
   - เพิ่ม `Breadcrumb` component (ดึงจาก `components/ui/breadcrumb.tsx`) และ `PageTitle` helper เพื่อแทน header Angular
   - เตรียม `loading.tsx`/`error.tsx` ในแต่ละกลุ่ม route
5. **Phase 3+: ค่อย ๆ พอร์ตโมดูลภายใน**
   - เริ่มจาก `overview` (ใช้ card/chart) → `tag` → `data` → `scheduling` → `event` → `interface` → `integration` → `security` → `log`
   - สำหรับแต่ละโมดูล ให้กำหนด data adapter, สร้าง form/ตารางตามแบบ shadcn, เขียน test เบื้องต้นก่อน merge

หมายเหตุ: รายการด้านบนควบคู่กับแผนระยะ 1-9 เดิม โดยปรับให้ Login + Permission อยู่ลำดับแรกสุด เพื่อให้ shell authenticated พร้อมก่อนพอร์ตหน้าภายใน

### Development Guidelines สำหรับธีมใหม่
- **โครงสร้างไฟล์**: ยึด pattern `/app/<route>/page.tsx` สำหรับ server component, ใช้ `components/features` และ `components/shared` สำหรับ client component; ห้ามซ้อน business logic ในไฟล์ `page.tsx` มากเกินไป ให้แยกเป็น hook/service ใน `lib/`
- **Styling**: ใช้เพียง Tailwind class + CSS variable ของธีม; หลีกเลี่ยงการเขียน CSS แยกเว้นจำเป็น ให้ใช้ helper `cn()` เพื่อลด class ซ้ำ
- **State & Data Fetching**: ใช้ Server Component + Server Action สำหรับ read-only ที่ทำได้ (ลด client bundle), ใช้ `use client` เฉพาะส่วนที่ต้อง interactive (form, chart); สำหรับ state ซับซ้อนเลือกใช้ Zustand หรือ React Query (ถ้าต้องการ caching ฝั่ง client)
- **Form & Validation**: มาตรฐานใช้ `react-hook-form` + `zod`; กำหนด schema ไว้ใน `lib/validation/<module>.ts` และแชร์ให้ทั้ง server/client เพื่อหลีกเลี่ยง duplicate rule
- **Toast/Feedback**: ใช้ `sonner` (`toast.success/error`) เป็นค่าเริ่มต้น แทน ngx-toastr; สำหรับ confirm ใช้ `AlertDialog`/`Dialog`
- **Icon & Illustration**: ใช้ `lucide-react` และ asset จากธีม (ห้ามใช้ icon คละไลบรารี); การเรียกใช้ `Image` ต้องกำหนด domain ใน `next.config.ts`
- **Theme & Responsive**: อย่าแก้โค้ดใน `components/ui/sidebar.tsx` โดยตรง ให้ปรับผ่าน prop หรือ wrapper; เคารพ breakpoint จาก hook `useIsMobile`/`useIsTablet`
- **Testing**: ตั้ง `@testing-library/react` + `vitest` หรือ `jest` สำหรับ unit (โดยเฉพาะ auth utility), เพิ่ม Playwright สำหรับ flow สำคัญ (login, permission guard, menu navigation)
- **Code Style**: ใช้ ESLint + Prettier ที่ติดตั้งกับธีม, เปิด `readable-tailwind` plugin เพื่อรักษาความสม่ำเสมอของ class order; commit message ใช้ conventional commits
- **Environment**: เก็บ secret ใน `.env.local`; หลีกเลี่ยง hardcode URL/credential ใน component; ใช้ `process.env.NEXT_PUBLIC_*` เฉพาะค่าที่เผยแพร่ได้

> ข้อมูลข้างต้นอ้างอิงจากการศึกษาโปรเจ็กต์ `shadcn-ui-kit-dashboard` และจะใช้เป็นฐานสำหรับการย้าย Angular → Next.js โดยคง UX/theme ให้กลมกลืน
