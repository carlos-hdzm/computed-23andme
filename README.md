# Computed 23andMe

***This project is not affiliated with 23andMe or TTAM.***

## Background
When testing with 23andMe, users get a view of their estimated ancestry regions as percentages, and on another section, a chromosome painter showing which chromosome sections were labeled as what region. There is a confidence selector which represents the confidence threshold for region assignment as per 23andMe's algorithm.

While this is informative and of enough value for most users, there is more data that users can download in their account settings.

## 23andMe's Computed Data
In particular, there is the **Computed Data**, as labeled by 23andMe. It is a CSV file which contains, among other profile data, information about the region estimates 23andMe assigned to every chromosome section *before* their [smoothing algorithm](https://customercare.23andme.com/hc/en-us/articles/115004339467-How-Ancestry-Composition-Works#smoothing). This algorithm corrects and reorders segments for statistical accuracy. Smaller segments often get smoothed out.

Without making any judgment on the accuracy of the unsmoothed Computed Data, it might be of interest to some users to visualize it.

## Computed 23andMe

**Computed 23andMe** does that: it parses the Computed Data CSV file and provides a region estimate table and chromosome browser.

The project uses TypeScript, and the UI is a React application using Vite. For state management, React Context is used across the application.

The CSV file is parsed with [`csvtojson`](https://www.npmjs.com/package/csvtojson), and the resulting JSON is consumable by the application. The data is never stored, only being processed locally.

The data from the JSON is processed in layers:
1. The relevant sections (region percentage estimates and chromosome sections) are extracted.
2. Each chromosome haplotype is split into its two arms for easier handling.
3. Chromosome sections are nested according to start and end positions.
4. Regions are nested as per 23andMe's hierarchy.
5. Regions are sorted in a similar fashion to 23andMe's display: broad and unassigned categories last, larger percentages first.

The Computed Data file also often contains information for several of 23andMe's algorithm versions (for example, recent downloads might contain data for v5.2, v5.9, and v7.0 ethnicity estimates). These versions and their corresponding confidence thresholds become selectable options in a dropdown at the top of the page.

If a user doesn't want to provide their own Computed Data, or doesn't have one (for example, if they haven't tested with 23andMe), they can see the functionality of the project with sample data.

## Future plans
The Computed Data file contains much more information than the region estimates and chromosome segments. It also includes Genetic Groups, Country Matches, Historical Matches, Haplogroups, among other parts of 23andMe's reports. This means that more functionality could be added to **Computed 23andMe**, along with technical improvements.

As of now, the following additions/improvements are being considered, in no particular order:
- ~~Provide functional sample data.~~
- Add unit tests with Vitest.
- Analyze the feasability of React 19's `use` API, along with `Suspense` for the `async` behavior (file processing).
- Improve UI.
- Look for and implement performance improvements.
- Historical Matches analysis (chromosome segment location, for example).