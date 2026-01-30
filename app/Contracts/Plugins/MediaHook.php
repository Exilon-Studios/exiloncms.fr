<?php

namespace ExilonCMS\Contracts\Plugins;

/**
 * Media/Image Hook Contract
 *
 * Plugins can implement this to:
 * - Add custom image drivers (S3, Cloudinary, etc.)
 * - Add image manipulation filters
 * - Add image optimization
 * - Add CDN support
 *
 * Example implementation in plugin.json:
 * "hooks": {
 *   "media": {
 *     "drivers": ["S3Storage", "CloudinaryCDN"],
 *     "filters": ["Watermark", "Blur"],
 *     "optimizers": ["WebPConverter", "ImageCompressor"]
 *   }
 * }
 */
interface MediaHook
{
    /**
     * Register custom storage drivers.
     *
     * @return array<string, mixed>
     */
    public function registerStorageDrivers(): array;

    /**
     * Register image manipulation filters.
     *
     * @return array<string, callable>
     */
    public function registerImageFilters(): array;

    /**
     * Register image optimizers.
     *
     * @return array<string, callable>
     */
    public function registerImageOptimizers(): array;

    /**
     * Get upload configuration for this plugin.
     *
     * @return array{allowed_types: array, max_size: int, storage_path: string}
     */
    public function getUploadConfig(): array;

    /**
     * Process image after upload.
     * Apply filters, optimization, CDN upload, etc.
     *
     * @return string Processed image URL
     */
    public function processUpload(string $imagePath, array $options = []): string;

    /**
     * Delete image from storage.
     * Handle CDN deletion, cache invalidation, etc.
     */
    public function deleteImage(string $imagePath): bool;

    /**
     * Get image URL with CDN if enabled.
     */
    public function getImageUrl(string $imagePath): string;
}
