async function test() {
  const ESV_API_KEY = "948f99e1f43d00f0d3fef28825fb24022c09a127";
  const query = encodeURIComponent("John 1");
  const response = await fetch(`https://api.esv.org/v3/passage/text/?q=${query}&include-passage-references=false&include-verse-numbers=true&include-first-verse-numbers=true&include-footnotes=false&include-footnote-body=false&include-headings=false&include-short-copyright=false&include-copyright=false`, {
    headers: {
      'Authorization': `Token ${ESV_API_KEY}`
    }
  });
  const data = await response.json();
  console.log(JSON.stringify(data.passages[0]));
}
test();
