import { NextResponse } from "next/server";

import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/generated/core/ApiError";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const response = await apiClient.tag.getTagById({ id });
    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "OK",
        data: response.data
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const message = (error.body as any)?.message ?? "Unable to load tag";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to load tag" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const payload = await request.json();
    const response = await apiClient.tag.updateTag({ id, body: payload });
    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "Tag updated",
        data: response.data ?? null
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to update tag";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to update tag" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const response = await apiClient.tag.deleteTag({ id });
    const statusCode = response.statusCode && response.statusCode >= 200 && response.statusCode < 600 ? response.statusCode : 200;

    return NextResponse.json(
      {
        message: response.message ?? "Tag deleted",
        data: response.data ?? null
      },
      { status: statusCode }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const status = error.status ?? 500;
      const body = error.body as any;
      const message = body?.message ?? body?.errors?.general?.[0] ?? "Unable to delete tag";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json({ message: "Unable to delete tag" }, { status: 500 });
  }
}
