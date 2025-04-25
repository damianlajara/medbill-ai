This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Running the app

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Documentation/Instructions + Things left to do/improve on

## Take Home for Medbill AI
* [Medbill AI Homepage](https://medbill.ai/)
* [Exercise Link](https://medbill-ai.notion.site/Dynamic-AI-Form-Frontend-Implementation-1be8c18b546847a2b9d79d2d3776a006)

### Things that need more attention: 
* Component Structure. For the lack of time, I was not able to make them as modular as I wanted to. I would've loved to have everything be it's own component (ThankYou screen, each input, footer etc).
* Error states. I did not handle visual border colors
* History and being able to go back and forth. Due to lack of time I wasn't really able to check if it works, but I was able to at least pre-populate the answers based on the API. However this raises the question of which one takes precedence? If the backend has a pre-populated answer and you go back to something you previously submitted, what should we show?
* Better typings for the BE server. I took advantage of the fact that NextJS allows us to handle requests, but none of those files in the BE have types (obviously aside from the NextJS Default like `NextApiResponse`, etc). To combat this, I made sure to handle the actual FE requests and type them accordingly.
* Did not add the checkmark to the multiple choice options


Note: I did leave a couple of TODO comments in the code as well - so I'm sure there is some overlap with some of the things mentioned above.

### Design Choices:
* Building out a stateless and modular API contract was for sure a tricky part given the requirements and constraints. I needed a way to link a few endpoints without having state. For example, the `/submit` and the `/question` endpoints both need to know about the next question (since the AI response can be dynamic). `/question` is in charge of getting the next question and submit needs to somehow let the consumer know that the previous answer is correct and allow them to get the next question. I opted in for a linked-list type of approach where `/question` will respond with the next ID of the question because in the API contract, we modeled every question with a reference to the next question via `nextQuestionId`. 
* Another tricky part was fetching all questions. We needed a way to have a list of question ids that we can fetch (or at least the first ID to get the form started). I ended up mocking a couple of questions with constant look up speeds by indexed each question object with it's ID, so that we can easily get the next question when calling `/submit`. Ideally, if we had a fully fledged app with a dedicated BE (preferably with state), we would make the calls in the BE when hitting those endpoints to fetch the questions we need.

### Models
* A question will have the following properties: `id`, `type`, `multiple`, `title`, `description`, `options`, `prepopulate`, `nextQuestionId`.  


* * `type` can be either `text` for normal text inputs or `multiple_choice` for checkboxes. I intentionally did not create a 'single' choice because that's just a multiple choice variant. And if we did, we would enter TS hell trying to create conditional types for all these possible edge cases (have a look at how MUI handles their combobox - TL;DR not pretty.)


* * `prepopulate` can either be a string (which will handle both the single select AND text inputs) or an array of strings for multiple choice options.


* * `options` is another conditional property that only exists for single or multiple choice options


* * `nextQuestionId` - handles the reference to the next dynamic question in the list. Spoke about


### Folder Structure
* There is only one route (`/`) - since this is a NextJS app, that will correlate to the `app/page.tsx` file
* components - houses all the components that are imported in the pages (not a lot due to lack of time)
* data - mocked data to feed our app
* app/api/<version> - our BE housing API routes. Every nested file in this dir correlates to one API endpoint
* requests - the FE fetching for each of the api endpoints above
* types - all of our TS typings