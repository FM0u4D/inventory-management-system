# 📜 Changelog – IMS Project (Frontend + Backend)


---

## 📅 2025-09-04 — Initial Debugging Phase

- ✅ Reviewed frontend/backend structure.
- ✅ Identified multipart upload issues (product image handling).
- ✅ Confirmed Spring Boot endpoints expecting `multipart/form-data`.
- ✅ Cleaned up DTO mapping using `ProductDTO.fromEntity()`.

---

## 📅 2025-09-05 — Authentication & Authorization

- ✅ Debugged and fixed `403 Forbidden` error on `/api/products/all`.
- ✅ Ensured JWT role-based access with `@PreAuthorize("hasRole('ADMIN')")`.
- ✅ Finalized working configuration for `AuthFilter`, `SecurityConfig`, and role mapping using `SimpleGrantedAuthority("ROLE_" + role)`.

---

## 📅 2025-09-07 — Static Files & Product Image Handling

- ✅ Refactored static file serving using `WebMvcConfigurer`.
- ✅ Images are served from `http://localhost:5050/images/products/`.
- ✅ Angular product component fallback behavior added for missing images (`fallback.png`).

## [1.0.0] – 2025-09-07

### Initial

- Spring Boot 3.3.5 / Java 23 baseline.
- IMS backend with JPA/Hibernate, Security, DTO mapping, REST APIs.
- Angular frontend bootstrap.

## [1.0.1] – 2025-09-08

### Database

- Migrated to **MySQL 8** (Workbench), updated JDBC URL (port 3307).
- Resolved Hibernate dialect warnings.
- Ensured schema `IMS_DB` and Spring profile `dev` active.

## [1.0.2] – 2025-09-08

### Backend

- **File uploads**
  - `product.image.upload-dir=${user.dir}/uploads/products`.
  - Filename sanitization + auto-create directories.
- **Static resources**
  - `WebMvcConfig` serves `GET /images/products/**` from `${user.dir}/uploads/products/`.
  - `spring.web.resources.static-locations=classpath:/public/`.
- **Security**
  - Permitted `/images/products/**`, `/swagger-ui/**`, `/v3/api-docs/**`.

## [1.0.3] – 2025-09-08

### Frontend

- Product images:
  - Precomputed `imageSrc` for clean templates.
  - Robust `onImageError` guard (no reload loops).
- Fallback asset path: `frontend/src/assets/images/fallback.png`.

## [1.0.4] – 2025-09-08

### Changed

- Role-based access tightened:
  - MANAGER access clarified for Sell/Purchase endpoints.
  - Admin-only endpoints remain protected.

## [1.0.5] – 2025-09-08

### Added

- Dev-friendly startup logging (prints `user.dir` and static resource mapping).

### Fixed

- Spring Security permits `GET /images/products/**` (public).
- Static handler returns **404** for missing images (instead of 403/500).

## [1.0.6] – 2025-09-12

### Fixed

- **Transactions page**
  - Resolved `ModelMapper MergingCollectionConverter ... UnmodifiableRandomAccessList`.
  - Added `ModelMapperConfig.setCollectionsMergeEnabled(false)`.
  - Replaced bulk list mapping with per-item mapping in `TransactionServiceImpl` and other services.

## [1.0.7] – 2025-09-13

### Changed

- **Images (Angular)**
  - Centralized product image URL building with `encodeURIComponent(filename)`.
  - Single cache-bust on initial map.

### Fixed

- **Manager vs Admin UX**
  - Gated UI routing/links by role to prevent “Access Denied” popups.
  - Anonymous `GET /images/products/**` allowed.

## [1.1.0] – 2025-09-14

### Added

- **Left sidebar redesign (Angular)**
  - Default left placement, responsive, no scrollbars.
  - Collapse hides brand text; section separators remain visible.
  - Red “Logout” button fixed to bottom.
  - Branding logo standardized: `src/assets/images/logo-ims.svg`.

### Changed

- **App shell**
  - Grid-based layout with semantic `aside` + `main`.
  - Removed accidental page-level scrolling.

### Fixed

- **Template QoL**
  - Resolved `isAdmin()` getter collision.
  - Fixed `routerLinkActiveOptions` binding errors.

## [1.1.1] – 2025-09-14

### Added

- **Customizer (UI shell) wiring**
  - Inputs/Outputs for open/close in `<app-customizer>`.
  - LocalStorage-backed preferences: `themeMode`, `layoutFluid`, `verticalNavStyle`, `navPosition`.
  - Immediate body/app-shell class toggles with persistence.

### Fixed

- **ApiService overload confusion**
  - Consolidated `getAllTransactions` overloads to avoid duplicate declarations.

## [1.1.2] – 2025-09-14

### Fixed

- **Angular typing & template issues**
  - Moved `prefs$` access to `ngOnInit` (`Property 'ui' is used before its initialization`).
  - Normalized event bindings (removed `$event.target.checked` errors).
  - Ensured `RouterLinkActive` is imported in `AppComponent` (standalone).
- **Dashboard build errors**
  - Corrected `ngx-charts` color inputs (valid `Color` descriptors + consistent view tuples).
  - Removed stray CSS syntax warnings.

### Changed

- **Global layout & overflow**
  - Sidebar/content split uses CSS Grid with app-level overflow centralized in `<main>`.
  - Tightened body margins/padding to eliminate extra whitespace.

## [1.1.3] – 2025-09-15
### Added
- Sidebar enhancements: chevron toggle, `lucide-angular` icons.
- Category reorder: drag-drop (Angular CDK), `position` field, `/reorder` endpoint.
- JWT: roles in token, `AuthFilter`, `SecurityConfig` role enforcement.
- Product row movement: `cdkDragMove`, direct row movement, pointer offset.
### Changed
- Icons renamed (`PlusCircle` → `CirclePlus`).
- Menu style + chevron glow improvements.
### Fixed
- Category reorder 403 (URL + Bearer token).
- Lucide icon import cleanup.
- Scrollbar & padding issues.
### Removed
- Old hamburger toggle + deprecated icons.

## [1.1.4] – 2025-09-16
### Added
- Product reorder: `cdkDropList`, drag effects (`mousedown`, `dragStart`), inline style.
- Product `position` field in DB + DTO.
- Backend:
  - `updatePosition(Long id, Integer position)` in `ProductRepository`.
  - `reorderProducts(List<Long>)` in `ProductServiceImpl`.
  - `PUT /api/products/reorder` endpoint (ADMIN only).
- Angular: `dropTableRow()` sends `{ id, position }[]` to persist order.
### Fixed
- Compilation error (return type mismatch in `ProductServiceImpl`).
- 403 error resolved (endpoint casing, user confirmed as ADMIN).


## 📅 2025-09-16 — Visual Feedback for Dragging

- ✅ Implemented custom inline styles on `mousedown` (grab) and release.
- ✅ Visual effect includes scale, shadow, background, and glowing outline.
- ✅ Cursor transitions between `grab` and `grabbing`.
- ✅ Final styles are removed after 100ms delay on `dragEnd`.

---

## 📅 2025-09-16 — Product Reordering Persistence (Backend + Frontend)

- ✅ Added `position` field to `Product` entity (with DB migration).
- ✅ Updated `ProductDTO` to include `position`.
- ✅ Exposed `PUT /api/products/reorder` in `ProductController` with `@PreAuthorize("hasRole('ADMIN')")`.
- ✅ Added `updateProductPositions()` method to `ProductService` and implemented in `ProductServiceImpl`.
- ✅ Optimized reorder logic by avoiding full entity loading, using:

  ```java
  @Modifying
  @Transactional
  @Query("UPDATE Product c SET c.position = :position WHERE c.id = :id")
  void updatePosition(@Param("id") Long id, @Param("position") Integer position);
  ```

- ✅ Frontend `dropTableRow()` now sends reordered list of `{ id, position }` to persist new order.

---

## ✅ Current Version: `v1.3.0`

- Stable
- Supports drag-and-drop product ordering with persistent position field
- Visually styled dragging
- JWT secured endpoint for reorder

---

## ✅ \[FEATURE] Add Product Reordering with Drag & Drop

### 🔧 Angular Frontend

- Enabled product reordering via Angular CDK `cdkDropList` and `cdkDrag`.
- Customized behavior to **move the actual row** rather than using `cdkDragPreview`.
- Replaced default drag preview with direct manipulation of DOM rows using inline styles.
- Implemented:

  - `onDragStarted()` — applied inline glow style, scaling, and pointer grab.
  - `onDragMoved()` — smoothly moves row with pointer.
  - `onDragEnded()` — cleans up inline styles after slight delay.

- Added `onRowMouseDown()` to apply visual styles _immediately on click_, using:

```ts
  transform: scale(1.01);
  opacity: 0.95;
  z-index: 1000;
  background: linear-gradient(...);
  box-shadow: ...;
```

### 🔧 Backend Spring Boot

- Added `position` field to `Product` entity (`Integer position`).
- Persisted this field in database.
- Added logic to update and persist new row order via:

```java
@PutMapping("/reorder")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> updatePositions(@RequestBody List<Long> orderedIds) {
    productService.reorderProducts(orderedIds);
    return ResponseEntity.ok().build();
}
```

- Changed previous `updateProductPositions(List<ProductDTO>)` implementation to:

```java
@Override
public Response reorderProducts(List<Long> orderedIds) {
    for (int i = 0; i < orderedIds.size(); i++) {
        productRepository.updatePosition(orderedIds.get(i), i);
    }
    return Response.builder().status(200).build();
}
```

- Updated `ProductRepository` with custom query:

```java
@Modifying
@Transactional
@Query("UPDATE Product c SET c.position = :position WHERE c.id = :id")
void updatePosition(@Param("id") Long id, @Param("position") Integer position);
```

### 🔧 Angular API Service

```ts
reorderProducts(ids: number[]) {
  return this.http.put(`${ApiService.BASE_URL}/products/reorder`, ids);
}
```

### ✅ Drag Visual Feedback

- No use of `cdkDragPreview` (removed).
- Replaced with manual inline visual cues on `mousedown`:

  - `box-shadow`, `text-shadow`, background gradient
  - Smooth transition between grab & grab release

- Ensured flickering or clone artifacts are fully suppressed.

### 🐞 Bug Fixes / Errors Resolved

- ✅ 403 error due to `@PreAuthorize` was acknowledged but not reproduced since user was confirmed as ADMIN.
- ✅ Compilation error due to mismatched return type in `ProductServiceImpl` corrected (from `void` ➝ `Response`).
- ✅ Flickering on drag removed by eliminating `cdk-drag-preview`, adding visual cue on actual element.

---

## ✅ \[PREVIOUSLY IMPLEMENTED FEATURE MATCHING CATEGORY REORDER]

- Reused `CategoryReorder` logic as a model for product order persistence.
- Ensured similar design with:

  - `@PutMapping("/categories/reorder")`
  - `categoryRepository.updatePosition()`
  - Same `@Modifying`, `@Transactional` pattern.

---

