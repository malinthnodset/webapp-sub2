// Furniture DTOs — based on Furniture, StudentFurniture and SceneViewModel in Subapp 1 (dev branch).
// Student ↔ Furniture is the many-to-many (N:M) relationship, through the StudentFurniture table.

// One piece of furniture that can be unlocked
export interface FurnitureDto {
  id: number;
  name: string;      // "Cat tree"
  slug: string;      // "cat-tree" — also the image name: /images/furniture/cat-tree.png
  sortOrder: number; // the order furniture is unlocked in
}

// What the pixel room should look like for the logged-in student
// Matches C#: SceneViewModel { bool CatOutOfBox; List<string> FurnitureSlugs; }
export interface SceneDto {
  catOutOfBox: boolean;
  furnitureSlugs: string[];
}
