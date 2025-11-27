import Layout from "@/components/layouts/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export const Category = () => {
  type Category = { id: string; name: string };

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
  const fetchCategories = async (page = 1, perPage = 10) => {
    try {
      const from = (page - 1) * perPage;
      const to = page * perPage - 1;

      const { data, count, error } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: true })
        .range(from, to);

      if (error) throw error;
      setCategories(data || []);
      setTotalMenus(count || 0);
    } catch (err: any) {
      console.error("Failed to fetch menus:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout title="Master Category">
      <div className="flex justify-between mb-4">{/* <Button onClick={openCreate}>+ Add Menu</Button> */}</div>

      {/* <DataTable columns={columns} data={menus} /> */}
      <div className="mt-6 space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex justify-between items-center p-3 border rounded">
            <span>{category.name}</span>

            {/* <div className="space-x-2">
              <Button variant="secondary" onClick={() => openEdit(menu)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={() => openDelete(menu)}>
                Delete
              </Button>
            </div> */}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={handlePrev} disabled={page === 1}>
          Prev
        </Button>
        <span>
          {" "}
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={page === totalPages}>
          Next
        </Button>
      </div>

      {/* CREATE / UPDATE MODAL */}
      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected ? "Update Menu" : "Add Menu"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-2 text-sm">Menu Name</label>
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
      </Dialog> */}

      {/* DELETE MODAL */}
      {/* <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <span className="font-bold">{selected?.name}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </Layout>
  );
};
