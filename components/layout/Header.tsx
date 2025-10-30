"use client";

import { MapPinPlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Header = () => {
  return (
    <header className="absolute z-2 left-auto w-[90%] flex items-center justify-between bg-white mt-4 rounded-xl p-4 shadow-lg">
      <h1 className="text-2xl flex-[30%] text-blue-700 font-bold">Apoio.RJ</h1>
      <div className="flex items-center gap-3 flex-[70%] justify-end">
        <Input
          type="text"
          placeholder="Encontre um ponto de Apoio"
          className="p-6 w-full flex-[80%] bg-gray-50"
        />
        <Button className="bg-blue-700 p-6 flex-[20%]">
          <MapPinPlusIcon /> Sugerir ponto
        </Button>
      </div>
    </header>
  );
};

export default Header;
