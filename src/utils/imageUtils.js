/**
 * Get proper image URL based on whether it's a filename or full URL
 * @param {string} photo - Photo filename or URL
 * @returns {string} - Complete image URL
 */
export const getImageUrl = (photo) => {
  if (!photo) return null;

  // If it's already a full URL (starts with http/https), return as-is
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }

  // If it's a filename, prepend the uploads path
  return `http://localhost:3000/uploads/${photo}`;
};
