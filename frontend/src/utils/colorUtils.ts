// Define return type for the function
export async function getBrightestColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        resolve('rgb(255, 255, 255)'); // Fallback to white
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      context.drawImage(img, 0, 0);
      
      try {
        // Get image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let maxBrightness = 0;
        let brightestRGB = { r: 255, g: 255, b: 255 }; // Default to white
        
        // Analyze every pixel
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          
          // Calculate perceived brightness
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          
          if (brightness > maxBrightness) {
            maxBrightness = brightness;
            brightestRGB = { r, g, b };
          }
        }
        
        resolve(`rgb(${brightestRGB.r}, ${brightestRGB.g}, ${brightestRGB.b})`);
      } catch (error) {
        resolve('rgb(255, 255, 255)'); // Fallback to white
      }
    };

    img.onerror = () => {
      resolve('rgb(255, 255, 255)'); // Fallback to white
    };

    img.src = imageUrl;
  });
}