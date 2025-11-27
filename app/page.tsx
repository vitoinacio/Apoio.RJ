import Mapa from "@/components/Mapa";
import Header from "../components/layout/Header";
import SideBar from "../components/SideBar";
import TagsChips from "../components/TagsChips";
import { MapsProvider } from "@/context/MapsContext";

export default function Home() {
  return (
    <MapsProvider>
      <Mapa>
        <Header />
        <TagsChips />
        <SideBar />
      </Mapa>
    </MapsProvider>
  );
}
