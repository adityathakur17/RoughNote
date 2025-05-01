"use client";

import { Input } from "@/components/ui/input";
import { CalendarIcon, Search } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { MOODS } from "@/lib/moods";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function JournalFilters({ entries }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [date, setDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState(entries);
  return (
    <div>
      <div>
        <Input
          placeholder="Search Entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          prefix={<Search className="h-4 w-4 text-gray-400" />}
        />
      </div>

      <Select value={selectedMood} onValueChange={setSelectedMood}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Filter by mood" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(MOODS).map((mood) => (
            <SelectItem key={mood.id} value={mood.id}>
              <span className="flex items-center gap-2">
                {mood.emoji}
                {mood.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline"
          className={cn("justify-start text-left front-normal", !date && "text-muted-foreground")} >
            <CalendarIcon className="h-4 w-4" />
            {date?format(date,"PPP"):<span>Pick a Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar 
          mode="single"
          selected={date}
          onSelect={setDate} //why did we do onSelect={setDate} and not onSelect={(e)=>setDate(e.target.value)}
          initialFocus //what does it do?
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default JournalFilters;
