"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "@/lib/schema";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMoodById, MOODS } from "@/lib/moods";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createJournalEntry } from "@/actions/journal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { createCollection, getCollections } from "@/actions/collection";
import CollectionForm from "@/components/collection-dialogue";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const JournalEntryPage = () => {
  const [isCollectionDialogueOpen, setIsCollectionDialogueOpen] =
    useState(false);

  const router = useRouter();
  const {
    loading: actionLoading,
    fn: actionFn,
    data: actionResult,
  } = useFetch(createJournalEntry);

  const {
    loading: collectionsLoading,
    fn: fetchCollections, //does this do the basic fetching that use-fetch does?
    data: collections,
  } = useFetch(getCollections);

  const {
    loading: createCollectionLoading,
    fn: createCollectionFn,
    data: createdCollection,
  } = useFetch(createCollection);

  useEffect(() => { //what does this do
    fetchCollections();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });

  useEffect(() => {
    if (actionResult && !actionLoading) {
      router.push(
        `/collection/${
          actionResult.collectionId ? actionResult.collectionId : "unorganized"
        }`
      );
      toast.success(`Entry created successfully`);
    }
  }, [actionResult, actionLoading]);

  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogueOpen(false);
      fetchCollections();//where can we see this fetching?
      setValue("collectionId", createdCollection.id);//what does this do
      toast.success(`Collection ${createdCollection.name} created!`);
    }
  }, [createdCollection]);

  const handleCreateCollection = async (data) => {
    createCollectionFn(data);
  };


  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data.mood);

    actionFn({
      ...data,
      moodScore: mood.score,
      moodQuery: mood.pixabayQuery,
    });
  });

  const isLoading = actionLoading || collectionsLoading;
  return (
    <div className="py-8">
      <form className="space-y-4 mx-auto" onSubmit={onSubmit}>
        <h1 className="text-5xl md:text-6xl gradient-title">
          What&apos;s on your mind?
        </h1>

        {isLoading && <BarLoader color="green" width={"100%"} />}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            readOnly={isLoading}
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`py-5 md:text-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => {
              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`w-full md:w-[1200px]  ${
                      errors.mood ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="How is your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MOODS).map((mood) => {
                      return (
                        <SelectItem key={mood.id} value={mood.id}>
                          {" "}
                          <span className="flex items-center gap-2">
                            {mood.emoji}
                            {mood.label}
                          </span>{" "}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {getMoodById(getValues("mood"))?.prompt || "Write your Thoughts..."}
          </label>

          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                readOnly={isLoading}
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "codeblock"],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Add to Collection (Optional)
          </label>

          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsCollectionDialogueOpen(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger className={"w-full md:w-[1200px]"}>
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections?.map((collection) => {
                      return (
                        <SelectItem
                          key={collection.id}
                          value={collection.id}
                        >
                          {collection.name}
                        </SelectItem>
                      );
                    })}
                    <SelectItem value="new">
                      <span className="text-green-700">
                        + Create New Collection
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.collectionId && (
            <p className="text-red-500 text-sm">
              {errors.collectionId.message}
            </p>
          )}
        </div>

        <div className="space-y-4 flex">
          <Button type="submit" variant="journal" disabled={actionLoading}>
            Publish
          </Button>
        </div>
      </form>

      <CollectionForm
        loading={createCollectionLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogueOpen}
        setOpen={setIsCollectionDialogueOpen}
      />
    </div>
  );
};

export default JournalEntryPage;
