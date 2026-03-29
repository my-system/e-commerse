// File mapping middleware for backward compatibility
const fileMapping = {
  // Group 1: All map to 1774710782218-b1x4jm5gfc8.jpeg
  '1774716469027-ykq3faugwl.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717085497-mqobzxtg05.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717461306-n448ut965hg.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774717591633-d3ut5kc4hk6.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774718772007-wab9ppdqq9.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720686803-kv5gdy0jnda.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720795452-iojzsm7ffy.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  '1774720882627-i689toz0dn9.jpeg': '1774710782218-b1x4jm5gfc8.jpeg',
  
  // Group 2: All map to 1774710787090-3saxy7yvsfa.jpeg
  '1774716469029-ml565tp45uh.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717085499-oce4mg4zlpe.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717461308-yzv82yh5j2q.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774717591635-dn7vj9ytl3e.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774718772009-8tts6abotpa.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774720686804-8owa7mr10o6.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774720795454-1j5ms349s2e.jpeg': '1774710787090-3saxy7yvsfa.jpeg',
  '1774720882629-ech4hqgpu7.jpeg': '1774720787090-3saxy7yvsfa.jpeg',
  
  // Group 3: All map to 1774710794400-rmm8dfqn1vb.jpeg
  '1774716469019-i0cqcn8q9qo.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774717085495-xf32vbs91v.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774717461304-rbialcsswnr.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774718772005-5m4b4m4aww9.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720686800-lxytkms8ata.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720795450-9ujbkysjatu.jpeg': '1774720794400-rmm8dfqn1vb.jpeg',
  '1774720882624-d3454a98d5m.jpeg': '1774720794400-rmm8dfqn1vb.jpeg'
};

// Function to map old file names to new ones
export function mapFileName(fileName) {
  return fileMapping[fileName] || fileName;
}

// Function to update image paths in product data
export function updateImagePaths(images) {
  if (typeof images === 'string') {
    images = JSON.parse(images || '[]');
  }
  
  return images.map(imagePath => {
    const fileName = imagePath.split('/').pop();
    const mappedFileName = mapFileName(fileName);
    return `/uploads/products/${mappedFileName}`;
  });
}

console.log('File mapping middleware loaded');
console.log('Mapping 23 deleted files to 4 existing files');
