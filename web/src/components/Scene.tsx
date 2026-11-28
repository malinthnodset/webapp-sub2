// Scene — the pixel room with the cat, drawn behind every page.
// React version of SceneViewComponent + Components/Scene/Default.cshtml in Subapp 1 (dev branch).
// The styles are in styles/scene.css (copied from Subapp 1).

import { useQuery } from '@tanstack/react-query';
import * as furnitureService from '../services/furnitureService';
import { useAuth } from '../context/useAuth';
import type { SceneDto } from '../types/furniture';

export default function Scene() {
  const { user } = useAuth();

  // Only fetch the room when someone is logged in (enabled).
  // The user id is part of the queryKey, so a new user gets their own room, not the previous user's.
  const { data: scene } = useQuery<SceneDto, Error>({
    queryKey: ['scene', user?.nameid],
    queryFn: furnitureService.fetchScene,
    enabled: !!user,
  });

  // Logged out (or still loading): the cat sits in its box in an empty room, same as Subapp 1
  const catOutOfBox = !!user && scene?.catOutOfBox === true;
  const furnitureSlugs = user ? (scene?.furnitureSlugs ?? []) : [];

  return (
    // Only decoration, so screen readers skip it
    <div className="pixel-scene" aria-hidden="true">
      <div className="pixel-scene__wall"></div>
      <div className="pixel-scene__baseboard"></div>
      <div className="pixel-scene__floor"></div>
      <div className="pixel-furniture pixel-furniture--window"></div>

      {/* One div per unlocked piece of furniture. The slug picks the CSS class, and with it the image. */}
      {furnitureSlugs.map((slug) => (
        <div key={slug} className={`pixel-furniture pixel-furniture--${slug}`}></div>
      ))}

      {/* Ternary: the free cat, or the cat in its box */}
      <div className={`pixel-cat ${catOutOfBox ? 'pixel-cat--idle' : 'pixel-cat--box'}`}></div>
    </div>
  );
}