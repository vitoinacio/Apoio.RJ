import Mapa from "@/components/Mapa";
import Header from "../components/layout/Header";
import SideBar from "../components/SideBar";
import TagsChips from "../components/TagsChips";

export default function Home() {
  return (
    <Mapa>
      <Header />
      <TagsChips />
      <SideBar />
    </Mapa>
  );
}
