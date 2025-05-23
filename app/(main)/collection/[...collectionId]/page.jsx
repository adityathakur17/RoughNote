//why is this a server component
//add drag and drop functionality
import { getCollection } from "@/actions/collection";
import { getJournalEntries } from "@/actions/journal";
import DeleteCollectionDialog from "../_components/delete-collection";
import JournalFilters from "../_components/journal-filters";



const CollectionPage = async ({params}) => {
  const { collectionId } = params;
  const id = Array.isArray(collectionId) ? collectionId[0] : collectionId;
  //providing the getJournalEntries with the collectionId
  const collection = await getCollection( id );
  const entries = await getJournalEntries({ collectionId:id });


  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold gradient-title">
            {collection.id === "unorganized"
              ? "Unorganized Entries"
              : collection?.name || "Collection"}
          </h1>
          {collection && (
            <DeleteCollectionDialog
              collection={collection}
              entriesCount={entries.data.entries.length}
            />
          )}
        </div>
        {collection?.description && (
          <h2 className="font-extralight pl-1">{collection?.description}</h2>
        )}
      </div>
      {/* render entries */}
      <JournalFilters entries={entries.data?.entries} />

  
    </div>
  );
};

export default CollectionPage;
