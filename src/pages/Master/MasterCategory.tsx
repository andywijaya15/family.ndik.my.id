import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import { Pagination } from "@/components/Pagination";
import { PerPageSelect } from "@/components/PerPageSelect";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/repositories/categoryRepository";
import type { Category } from "@/types/database";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { toast } from "sonner";

export const MasterCategory = () => {
  const { setTitle } = useOutletContext<{ setTitle: (v: string) => void }>();

  useEffect(() => {
    setTitle("Master Category");
  }, []);

  const { session } = useAuth();
  const userId = session?.user?.id ?? null;

  const [name, setName] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(totalCategories / perPage);

  const fetchCategories = async (page = 1, perPageValue = perPage) => {
    const { data, count, error } = await getCategories(page, perPageValue);
    if (error) return console.error(error);

    setCategories(data || []);
    setTotalCategories(count || 0);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // CREATE / UPDATE
  const save = async () => {
    const formatted = name.toUpperCase().trim();
    if (!formatted) return toast.error("Category name cannot be empty");

    if (!selected) {
      const { error } = await createCategory({
        name: formatted,
        type: "EXPENSE",
        created_by: userId,
        updated_by: userId,
      });
      if (error) return toast.error(error.message);
      toast.success("Created!");
    } else {
      const { error } = await updateCategory(selected.id, {
        name: formatted,
        updated_by: userId,
      });
      if (error) return toast.error(error.message);
      toast.success("Updated!");
    }

    setPage(1);
    await fetchCategories(1, perPage);
    setOpenForm(false);
    setSelected(null);
    setName("");
  };

  // DELETE
  const remove = async () => {
    if (!selected) return;

    const { error } = await deleteCategory(selected.id, userId);
    if (error) return toast.error(error.message);

    toast.success("Deleted!");
    setPage(1);
    await fetchCategories(1, perPage);
    setOpenDelete(false);
    setSelected(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        <Button
          onClick={() => {
            setSelected(null);
            setName("");
            setOpenForm(true);
          }}
          className="w-full sm:w-auto"
        >
          + Add Category
        </Button>

        <PerPageSelect
          perPage={perPage}
          onChange={(newPerPage) => {
            setPerPage(newPerPage);
            setPage(1);
            fetchCategories(1, newPerPage);
          }}
        />
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
          const newPage = page - 1;
          setPage(newPage);
          fetchCategories(newPage);
        }}
        onNext={() => {
          const newPage = page + 1;
          setPage(newPage);
          fetchCategories(newPage);
        }}
      />

      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selected ? "Update Category" : "Add Category"}
        onSubmit={save}
        submitLabel={selected ? "Update" : "Create"}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Category Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" autoFocus />
          </div>
        </div>
      </FormDialog>

      <ConfirmDeleteDialog open={openDelete} onOpenChange={setOpenDelete} itemName={selected?.name} onDelete={remove} />
    </>
  );
};
