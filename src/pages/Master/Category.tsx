import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import Layout from "@/components/layouts/Layout";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/repositories/categoryRepository";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Category = { id: string; name: string };
export const Category = () => {
  const { session } = useAuth();
  const userId = session?.user?.id ?? null;
  const [name, setName] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [totalMenus, setTotalMenus] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(totalMenus / perPage);

  const fetchCategories = async (page = 1, perPage = 10) => {
    const { data, count, error } = await getCategories(page, perPage);
    if (error) return console.error(error);
    setCategories(data || []);
    setTotalMenus(count || 0);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const save = async () => {
    const formatted = name.toUpperCase();

    if (!selected) {
      const { error } = await createCategory(formatted, userId);
      if (error) return toast.error(error.message);
      toast.success("Created!");
    } else {
      const { error } = await updateCategory(selected.id, formatted, userId);
      if (error) return toast.error(error.message);
      toast.success("Updated!");
    }

    setPage(1);
    await fetchCategories(1);
    setOpenForm(false);
    setSelected(null);
    setName("");
  };

  const remove = async () => {
    if (!selected) return;
    const { error } = await deleteCategory(selected.id, userId);
    if (error) return toast.error(error.message);

    toast.success("Deleted!");
    setPage(1);
    await fetchCategories(1);
    setOpenDelete(false);
    setSelected(null);
  };

  return (
    <Layout title="Master Category">
      <div className="flex justify-between mb-4">
        {<Button onClick={() => setOpenForm(true)}>+ Add Category</Button>}
      </div>

      <DataTable
        columns={[
          { accessorKey: "name", header: "Name" },
          {
            id: "actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelected(row.original);
                    setName(row.original.name);
                    setOpenForm(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setSelected(row.original);
                    setOpenDelete(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={categories}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => {
          setPage(page - 1);
          fetchCategories(page - 1);
        }}
        onNext={() => {
          setPage(page + 1);
          fetchCategories(page + 1);
        }}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selected ? "Update Category" : "Add Category"}
        onSubmit={save}
        submitLabel={selected ? "Update" : "Create"}
      >
        <div>
          <label className="block mb-2 text-sm">Category Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" autoFocus />
        </div>
      </FormDialog>

      <ConfirmDeleteDialog open={openDelete} onOpenChange={setOpenDelete} itemName={selected?.name} onDelete={remove} />
    </Layout>
  );
};
