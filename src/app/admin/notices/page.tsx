"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, PencilIcon, Trash2Icon, PinIcon } from "lucide-react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("notices")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setNotices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setIsPinned(false);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (notice: Notice) => {
    setEditingId(notice.id);
    setTitle(notice.title);
    setContent(notice.content);
    setIsPinned(notice.is_pinned);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("notices")
        .update({ title, content, is_pinned: isPinned })
        .eq("id", editingId);
      if (error) {
        alert("수정에 실패했습니다: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("notices")
        .insert({ title, content, is_pinned: isPinned });
      if (error) {
        alert("등록에 실패했습니다: " + error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setDialogOpen(false);
    resetForm();
    fetchNotices();
  };

  const handleDelete = async (id: string, noticeTitle: string) => {
    if (!confirm(`"${noticeTitle}" 공지를 삭제하시겠습니까?`)) return;
    await supabase.from("notices").delete().eq("id", id);
    fetchNotices();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">공지 관리</h2>
        <Button onClick={openCreateDialog}>
          <PlusIcon className="size-4" />
          공지 작성
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공지사항 ({notices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              로딩 중...
            </p>
          ) : notices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              등록된 공지사항이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col">
              {notices.map((notice, idx) => (
                <div key={notice.id}>
                  {idx > 0 && <Separator />}
                  <div className="flex items-start justify-between gap-3 py-3">
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {notice.title}
                        </span>
                        {notice.is_pinned && (
                          <Badge variant="default" className="gap-0.5">
                            <PinIcon className="size-2.5" />
                            고정
                          </Badge>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {notice.content}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notice.created_at)}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(notice)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(notice.id, notice.title)}
                      >
                        <Trash2Icon className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "공지 수정" : "공지 작성"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notice-title">제목</Label>
              <Input
                id="notice-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지 제목"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notice-content">내용</Label>
              <Textarea
                id="notice-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="공지 내용을 입력하세요"
                rows={5}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>상단 고정</Label>
              <Switch checked={isPinned} onCheckedChange={setIsPinned} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              취소
            </DialogClose>
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? "저장 중..."
                : editingId
                  ? "수정"
                  : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
