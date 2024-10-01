// Declare the module
declare module './data' {
  // Define the types of what's exported from data.js
  // For example, if data.js exports an array of objects:
  interface DataItem {
    id: number;
    name: string;
    // Add other properties as needed
  }

  const data: DataItem[];

  export default data;
}
