"use-client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionSchema } from "@/lib/schema";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { BarLoader } from "react-spinners"; 

const CollectionForm = ({ onSuccess, open, setOpen, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionSchema), //what does this thing do?
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    onSuccess(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle >Create New Collection</DialogTitle>
        </DialogHeader>
        {loading && <BarLoader color="green" width={"100%"} />}
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Name</label>
            <Input
              readOnly={loading} //what?
              {...register("name")}//what?
              placeholder="Enter collection name..."
              className={` ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Collection Name</label>
            <Textarea
              readOnly={loading}
              {...register("description")}
              placeholder="Describe your collection..."
              className={` ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="journal">
                Create Collection
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionForm;
