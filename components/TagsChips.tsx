"use client";

import {
  GraduationCap,
  Handshake,
  ShieldCheck,
  Stethoscope,
  Wifi,
} from "lucide-react";
import { Badge } from "./ui/badge";

const tags = [
  {
    id: 1,
    title: "Segurança",
    icon: ShieldCheck,
    color: "text-blue-900",
  },
  {
    id: 2,
    title: "Educação",
    icon: GraduationCap,
    color: "text-orange-500",
  },
  {
    id: 3,
    title: "Saúde",
    icon: Stethoscope,
    color: "text-green-900",
  },
  {
    id: 4,
    title: "Assistência",
    icon: Handshake,
    color: "text-yellow-900",
  },
  {
    id: 5,
    title: "Internet",
    icon: Wifi,
    color: "text-gray-500",
  },
];

const TagsChips = () => {
  return (
    <div className="w-[65%] z-2 top-24 flex justify-center items-center gap-7 mt-4 absolute right-0">
      {tags &&
        tags.map((tag) => (
          <Badge
            key={tag.id}
            className={`${tag.color} p-2 bg-gray-50 cursor-pointer hover:bg-blue-100 hover:scale-105 transition-all shadow-lg`}
          >
            <tag.icon />
            <p>{tag.title}</p>
          </Badge>
        ))}
    </div>
  );
};

export default TagsChips;
