// furnitureService — what the pixel room looks like for the logged-in student.
// Same data as FurnitureService.GetSceneAsync in Subapp 1 (dev branch).

import { API_URL, getAuthHeaders, handleResponse, mockDelay } from './api';
import type { SceneDto } from '../types/furniture';

const USE_MOCK = false; // TODO: set to false when GET /api/furniture/scene exists in the API

// GET /api/furniture/scene → is the cat out of its box, and which furniture does the student own?
export async function fetchScene(): Promise<SceneDto> {
  if (USE_MOCK) return mockDelay({ catOutOfBox: true, furnitureSlugs: ['rug', 'cat-tree', 'plant'] });

  const response = await fetch(`${API_URL}/api/furniture/scene`, { headers: getAuthHeaders() });
  return handleResponse<SceneDto>(response);
}