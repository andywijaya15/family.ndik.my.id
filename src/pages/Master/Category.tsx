import Layout from "@/components/layouts/Layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/repositories/categoryRepository";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Category = { id: string; name: string };
export const Category = () => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [totalMenus, setTotalMenus] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(totalMenus / perPage);

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchCategories(newPage, perPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchCategories(newPage, perPage);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setName("");
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setSelected(category);
    setName(category.name);
    setOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelected(category);
    setDeleteOpen(true);
  };

  const fetchCategories = async (page = 1, perPage = 10) => {
    const { data, count, error } = await getCategories(page, perPage);
    if (error) return console.error(error);
    setCategories(data || []);
    setTotalMenus(count || 0);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    const formattedName = name.toUpperCase();

    // CREATE
    if (!selected) {
      const { error } = await createCategory(formattedName, userId);

      if (error) {
        toast.error(error.message); // ⬅️ ALERT ERROR DI SONNER
        return;
      }

      toast.success("Category created!"); // ⬅️ ALERT SUKSES
    }

    // UPDATE
    else {
      const { error } = await updateCategory(selected.id, formattedName, userId);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Category updated!");
    }

    setPage(1);
    await fetchCategories(1, perPage);
    setOpen(false);
    setSelected(null);
    setName("");
  };

  const handleDelete = async () => {
    if (!selected) return;

    const { error } = await deleteCategory(selected.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Category deleted!");

    setPage(1);
    await fetchCategories(1, perPage);

    setDeleteOpen(false);
    setSelected(null);
  };

  const columns: ColumnDef<Category>[] = [
    { accessorKey: "name", header: "Name", cell: ({ row }) => row.original.name },
    {
      id: "actions",
      header: "#",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => openEdit(category)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => openDelete(category)}>
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout title="Master Category">
      <div className="flex justify-between mb-4">{<Button onClick={openCreate}>+ Add Category</Button>}</div>

      <DataTable columns={columns} data={categories} />
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} disabled={page === 1}>
          Prev
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>

      {/* CREATE / UPDATE MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Update Category" : "Add Category"}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 text-sm">Category Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama menu"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selected ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete <span className="font-bold">{selected?.name}</span>?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
