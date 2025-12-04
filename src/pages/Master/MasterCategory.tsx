import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormDialog } from "@/components/FormDialog";
import { Pagination } from "@/components/Pagination";
import { PerPageSelect } from "@/components/PerPageSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/repositories/categoryRepository";
import type { Category } from "@/types/database";
import { Edit2, FolderOpen, List, Plus, Trash2 } from "lucide-react";
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
      toast.success("Category created successfully!");
    } else {
      const { error } = await updateCategory(selected.id, {
        name: formatted,
        updated_by: userId,
      });
      if (error) return toast.error(error.message);
      toast.success("Category updated successfully!");
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

    toast.success("Category deleted successfully!");
    setPage(1);
    await fetchCategories(1, perPage);
    setOpenDelete(false);
    setSelected(null);
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-xl dark:bg-primary/20">
            <List className="size-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Categories</h2>
            <p className="text-muted-foreground text-sm">Manage your expense categories</p>
          </div>
        </div>

        <Button
          onClick={() => {
            setSelected(null);
            setName("");
            setOpenForm(true);
          }}
          className="shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          size="lg"
        >
          <Plus className="mr-2 size-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Card */}
      <Card className="border-border/50 overflow-hidden dark:border-border/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-xl dark:bg-primary/20">
                <FolderOpen className="size-7" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Categories</p>
                <p className="text-3xl font-bold">{totalCategories}</p>
              </div>
            </div>
            <PerPageSelect
              perPage={perPage}
              onChange={(newPerPage) => {
                setPerPage(newPerPage);
                setPage(1);
                fetchCategories(1, newPerPage);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="border-border/50 hidden md:block">
        <CardContent className="p-6">
          <DataTable
            columns={[
              {
                accessorKey: "name",
                header: "Category Name",
                cell: ({ row }) => (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                      <List className="size-4" />
                    </div>
                    <span className="font-medium">{row.original.name}</span>
                  </div>
                ),
              },
              {
                accessorKey: "type",
                header: "Type",
                cell: ({ row }) => (
                  <span className="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-3 py-1 text-xs font-medium dark:bg-destructive/20 dark:text-red-400">
                    {row.original.type}
                  </span>
                ),
              },
              {
                id: "actions",
                header: "Actions",
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
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Edit2 className="mr-1 size-3" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelected(row.original);
                        setOpenDelete(true);
                      }}
                      className="hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="mr-1 size-3" />
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={categories}
          />
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {categories.length === 0 ? (
          <Card className="border-border/50 dark:border-border/30">
            <CardContent className="p-8 text-center">
              <FolderOpen className="text-muted-foreground mx-auto mb-3 size-12" />
              <p className="text-muted-foreground text-sm">No categories found</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="border-border/50 overflow-hidden dark:border-border/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-lg dark:bg-primary/20">
                      <List className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{category.name}</p>
                      <span className="bg-destructive/10 text-destructive mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium dark:bg-destructive/20 dark:text-red-400">
                        {category.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelected(category);
                        setName(category.name);
                        setOpenForm(true);
                      }}
                      className="hover:bg-primary/10 hover:text-primary transition-colors dark:hover:bg-primary/20"
                    >
                      <Edit2 className="size-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelected(category);
                        setOpenDelete(true);
                      }}
                      className="hover:bg-destructive/90 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
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

      {/* Form Dialog */}
      <FormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        title={selected ? "Update Category" : "Add New Category"}
        onSubmit={save}
        submitLabel={selected ? "Update Category" : "Create Category"}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category Name</label>
            <div className="relative">
              <List className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., GROCERIES, TRANSPORT"
                className="pl-10"
                autoFocus
              />
            </div>
            <p className="text-muted-foreground text-xs">Category name will be automatically converted to uppercase</p>
          </div>
        </div>
      </FormDialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog open={openDelete} onOpenChange={setOpenDelete} itemName={selected?.name} onDelete={remove} />
    </div>
  );
};
