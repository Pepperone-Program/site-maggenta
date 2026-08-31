import type { Metadata } from "next";
import NotFound from "../not-found";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: noIndexRobots,
};

export default NotFound;
