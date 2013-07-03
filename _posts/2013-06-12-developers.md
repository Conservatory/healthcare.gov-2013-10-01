---
published: true
layout: "basic-full-page"
lang: en
experience: learn
---

#  HealthCare.gov for Developers

We’re making our source code freely available on GitHub. All of our educational content about the [Health Insurance Marketplace](/marketplace/individual) is available in machine-readable formats so that innovators, entrepreneurs, and partners can turn it into new products and services. 

## Open Source and Accessible
[HealthCare.gov's](http://www.healthcare.gov/) source code and content are accessible in two important ways:


1. **All content is available through an API.** Everyone can use the API to embed content from HealthCare.gov. As official content gets updated on HealthCare.gov, the new content will update automatically and appear on websites using the HealthCare.gov API.

2. **EVERYTHING we do will be published on GitHub:** From revising a glossary entry to updating a link in the footer, we're making all of our changes transparent and available to the public.

From day one, we embraced the principles of open data, universal access, and accessibility through simplicity. We produce standards compliant code to make our content [accessible](/accessibility) to people with disabilities.

## HealthCare.gov Content API

Our web content is published as HTML pages and JSON data. JSON stands for [JavaScript Object Notation](http://www.json.org/) and it is a machine-readable data exchange format. Use our JSON API to build applications and websites that share the latest content from HealthCare.gov.

### API Endpoints

There are three types of data available through `HTTP GET` requests to the HealthCare.gov Content API:

- Content objects: the body content and metadata for each post on this website
- Content collections: groups of posts by type of content, such as article or glossary term
- Content index: a site-wide index of all posts and their metadata


Each endpoint will return a JSON object or array or data.

**Content objects**

Each content post is available as JSON object. To access a JSON object for a post, replace the trailing slash on the end of a post’s URL with the extension `.json`.

Request structure:

    https://www.healthcare.gov/:post-title.json

Response structure:

- **Attributes for glossary:** Date, Layout, Title, Categories, ID, Language, URL & Content
- **Attributes for articles and pages:** Date, Layout, Title, Categories, ID, Language, URL, Content, Tags & Order
- **Attributes for blog posts:** Date, Layout, Title, Categories, ID, Language, URL, Author, Tags, Topics & Content

Example:

    https://www.healthcare.gov/what-is-the-health-insurance-marketplace.json

**Content collections**

Collections are a list of post objects by content type. The following content types are available: `articles`, `blog`, `questions`, `glossary`, `states`, and `topics`. 

Request structure:

    https://www.healthcare.gov/api/:content-type.json

Response structure:

Collects return a JSON object with a single key and value. The key is the content type, and the value is an array  of post objects, defined above.

Example:

     https://www.healthcare.gov/api/glossary.json

**Content Index**

The index is an abridged list of metadata for all posts on this website. Use it to get an aggregate view of content and to generate additional queries of post objects.

Request structure:

    https://www.healthcare.gov/api/index.json

Response structure:

The index API returns an array of summary objects for the metadata of each post.

    {
        "tags": [],       // An array of content tags, such as "promote"
        "categories": [], // Content types and language code
        "topics": [],     // Associated topics (for articles)
        "title": "",      // The post's title
        "es-title": ""    // Spanish translation of the post's title,
        "url": "",        // URL to the HTML version of the post (add .json for post object)
        "bite": "",       // A short summary of the post
        "es-bite": "",    // The post summary in Spanish
        "state": []       // Associated states for the post
    }

Additional metadata fields may be available to further categorize some posts.

Example:

    https://www.healthcare.gov/api/index.json

### Using the content API

Most web and application frameworks include support for working directly with JSON. For example, the following JavaScript code uses the popular JQuery library to request a definition for a glossary term and insert it into containers on a web page:

    $.getJSON('https://www.healthcare.gov/glossary/childrens-health-insurance-program-chip.json', function(d) {
        $('h1').html(d.title);
        $('#content').html(d.content);
    });

For more information about JSON and resources in various programming languages, please see the [JSON specification documentation](http://www.json.org/).

**Cross-domain requests**

For client-side JavaScript applications, the HealthCare.gov API supports cross-domain requests. The API is CORS-enabled, which means that it authorizes requests for content from other origin servers. With CORS enabled, making cross-domain API requests in modern web browsers is done the in the same way that same-domain requests are made, like in the above example. [Read more about using CORS](http://enable-cors.org/index.html).

The API also supports JSONP requests. By adding a `callback` parameter to the request, the API will wrap the response in the value of the `callback` parameter, for example:

    https://www.healthcare.gov/glossary/childrens-health-insurance-program-chip.json?callback=myFunction

This allows the request to be embedded as a script instead of a JSON object that needs to be parsed. JSONP is considered less secure than CORS, but in some cases with a trusted host, it is a useful solution. [Read more about JSONP](http://en.wikipedia.org/wiki/JSONP). 


## HealthCare.gov on GitHub

![A view of our GitHub activity leading up to the launch of the new HealthCare.gov.](/assets/git-hub-hc2.PNG)

_Our GitHub activity leading up to the launch of the new HealthCare.gov._

- **Coming soon:** HealthCare.gov Source Code
- **Coming soon:** Prose

## Other Federal Resources for Developers

- [Assets.CMS.gov](http://assets.cms.gov/Resources/Framework/Pages/index.html)
- [HHS Developers Center](http://www.hhs.gov/developer/)
- [HHS.gov/DigitalStrategy](http://www.hhs.gov/digitalstrategy)
- [WhiteHouse.gov/Developers](http://www.whitehouse.gov/developers)
- [Digital Services Innovation Center](http://gsablogs.gsa.gov/dsic/join-in/)
- [HowTo.gov](http://www.howto.gov/mobile/apis-in-government)
- [DigitalGov Blog](http://blog.howto.gov/)

<script>$('#header .btn-lang').remove();</script>
