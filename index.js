const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://en.wikipedia.org/wiki/Statistical_area_(United_States)';

async function scrapeWikipedia() {
  try {
    // Fetch the HTML content of the Wikipedia page
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into Cheerio
    const $ = cheerio.load(html);

    // Select the table directly by its position (index)
    const targetTable = $('table').eq(2); // Change the index if needed

    // Create an array to store the content of the <a> elements
    const content = [];

    // Iterate through each row of the target table
    targetTable.find('tbody tr').each((index, row) => {
      // Find the content of the <a> element in the second column (index 1)
      const aElement = $(row).find('td').eq(1).find('a[title]');
      const elementContent = aElement.text().trim();
      if (elementContent) {
        content.push(elementContent);
      }
    });

    // Define the output file path
    const outputFile = 'statistical-area.json';

    // Write the content to a JSON file
    fs.writeFileSync(outputFile, JSON.stringify(content, null, 2), 'utf-8');
    console.log(`Content has been written to ${outputFile}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

scrapeWikipedia();
