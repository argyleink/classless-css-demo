import { serve } from "https://deno.land/std@0.152.0/http/server.ts";
import { join } from "https://deno.land/std@0.152.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.152.0/media_types/mod.ts";
import template from "./src/flora.ts";

import { Route, Framework } from "./src/types.ts";
import frameworks from "./src/frameworks.ts";

class StaticFileHandler {

  #basePath: string = "";

  constructor(base: string) {
    this.#basePath = base;
  }

  handler(request: Request): Response {
    const pathname = new URL(request.url).pathname;
    const extension = pathname.substr(pathname.lastIndexOf("."));
    const resolvedPathname = (pathname == "" || pathname == "/") ? "/index.html" : pathname;
    const path = join(Deno.cwd(), this.#basePath, resolvedPathname)
    const file = Deno.readFile(path)
      .then(data => new Response(data, { status: 200, headers: { 'content-type': contentType(extension) } })) // Need to think about content tyoes.
      .catch(_ => new Response("Not found", { status: 404 }));

    return file;
  }

  get pattern(): URLPattern {
    return new URLPattern({ pathname: "*" })
  }
}

const render = (currentFramework) => {
  return template`
  <link rel="stylesheet" href="${frameworks[currentFramework].cssUrl.toString()}">

  <h1>Welcome</h1>
  <p>I was struggling to make a simple page I was building look decent. 
     I knew there were stylesheets just used 'semantic html' (like Tufte) and didn't require any special className 
     (i.e <code>&ltbutton class="btn-primary"&gt;a button&lt;/button&gt;</code>), however I was struggling to find them.</p>
  <blockquote>I should know this, but I'm looking for a simple CSS stylesheet that would replace the default user agent and make it look half decent. Google-fu is failing me, all I can find is resets and full frameworks. :\\
  </blockquote> &mdash; <a href="https://twitter.com/Paul_Kinlan/status/1560769014787411969">Twitter</a>:

  <p>Once I found examples of 'class-less CSS', it was a bit of a pain to find them and compare all the different examples. Hence this page.</p>

  <p>This page is designed to collate all the CSS frameworks into one place and let you compare and contrast them.</p>
  
  <p>Here is the list of class-less CSS frameworks that you can checkout:</p>

  <ul>
    ${Object.values(frameworks).map(framework => template`<li><a href="${framework.htmlUrl}">${framework.name}</a> - <a href="${framework.siteUrl}">homepage</a></li>`)}
  </ul>

  <p>If you have a framework you would like include, create PR against <a href="https://github.com/PaulKinlan/classless-css-demo/blob/main/src/frameworks.ts">frameworks.ts</a></p>
  
  <p><a href="https://paul.kinlan.me/">Check out my other site.</a></p>
  <hr>

  <p>This page is rendered using ${frameworks[currentFramework].name}.</p>
  <p>Some of the entries are taken from the layout from <a href="https://vasanthv.com/stylize.css/demo.html">stylize</a>.</p>

  <section>
			<h2>Typography:</h2>
			<h1>This is a H1 heading</h1>
			<h2>This is a H2 heading</h2>
			<h3>This is a H3 heading</h3>
			<h4>This is a H4 heading</h4>
			<h5>This is a H5 heading</h5>
			<h6>This is a H6 heading</h6>
			<p>This is a paragraph of text. It's my paragraph. I like it a lot.</p>
			<br>
			<strong>This is a Strong / Bold text</strong>
			<br>
			<i>This is an Emphasized / Italic text</i>
			<br>
			This is a <mark>Marked / Highlighted</mark> text
			<br>
			<small>This is a Small text</small>
			<br>
			This is a <del>Deleted</del> text
			<br>
			This is a <ins>Underlined / Inserted</ins> text
			<br>
			This is a <sub>Subscript</sub> text
			<br>
			This is a <sup>Superscript</sup> text
			<br>
			<pre>This is a preformatted text.</pre>
			<blockquote>This is a Blockquote.</blockquote>
			<samp>This is a sample output.</samp>
			<br>
			This is the <code>&lt;code&gt;</code> &amp; <kbd>kbd</kbd>
			<br>
			<h3>Links &amp; navigation:</h3>
			<nav>
				<a href="#">Nav Link 1</a>
				<a href="#">Nav Link 2</a>
				<div class="right">
					<a href="#">Nav Link 3</a>
				</div>
			</nav>
			<br>
			<br>
			<a href="#">Normal link</a>
		</section>
    <section>
    <h2>Lists:</h2>
    <ul>
      <li>Unordered list item 1</li>
      <li>Unordered list item 2</li>
      <ul>
        <li>Unordered list item 3</li>
      </ul>
      <li>Unordered list item 4</li>
      <li>Unordered list item 5</li>
    </ul>
    <ol>
      <li>Ordered list item 1</li>
      <li>Ordered list item 2</li>
      <ol>
        <li>Ordered list item 3</li>
      </ol>
      <li>Ordered list item 4</li>
      <li>Ordered list item 5</li>
    </ol>
  </section>
  <section>
			<h2>Form:</h2>
			<fieldset>
				<legend>This is a legend on fieldset</legend>
				<form>
					<br>
					<label>Label:</label>
					<input type="text" placeholder="Text field">
					<br>
					<label>Select box:</label>
					<select>
						<optgroup label="Option group">
							<option>Option 1</option>
							<option>Option 2</option>
							<option>Option 3</option>
						</optgroup>
					</select>
					<br>
					<label>Numeric Field:</label>
					<input type="number" placeholder="Number" value="0">
					<br>
					<label>Checkboxes:</label>
					<label>Option 1 <input type="checkbox" checked=""></label>
					<label>Option 2 <input type="checkbox"></label>
					<br>
					<label>Radio buttons:</label>
					<label>Yes <input type="radio" checked=""></label>
					<label>No <input type="radio"></label>				
					<br>
					<textarea placeholder="Textarea" rows="3" cols="50"></textarea>
					<br>
					<input type="submit" value="Submit button">
				</form>
			</fieldset>
			<br>
			<button>Button</button>
			<a href="javascript:void(0)" role="button">Anchor role=button</a>
			<input type="button" value="Input type=button">
			<button disabled="">Button</button>
			<br>
			<label>Progress bar</label>
			<progress value="22" max="100"></progress>
      </section>
      <section>
			<h2>Table:</h2>
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Username</th>
						<th>Location</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>1</th>
						<td>Vasanth</td>
						<td>@vsnthv</td>
						<td>Chennai, India</td>
					</tr>
					<tr>
						<th>2</th>
						<td>John</td>
						<td>@john</td>
						<td>USA</td>
					</tr>
					<tr>
						<th>3</th>
						<td>Chan</td>
						<td>@chan</td>
						<td>Hong Kong</td>
					</tr>
				</tbody>
			</table>
			<p>Table with <code>border=1</code></p>
			<table border="1">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Username</th>
						<th>Location</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>1</th>
						<td>Vasanth</td>
						<td>@vsnthv</td>
						<td>Chennai, India</td>
					</tr>
					<tr>
						<th>2</th>
						<td>John</td>
						<td>@john</td>
						<td>USA</td>
					</tr>
					<tr>
						<th>3</th>
						<td>Chan</td>
						<td>@chan</td>
						<td>Hong Kong</td>
					</tr>
				</tbody>
			</table>
		</section>
    <section>
			<h2>Utility classes:</h2>
			<p>Apart from this, stylize.css comes with few utility classes as below.</p>
			<pre>&lt;div class="left"&gt; &lt;!-- Float left any element --&gt;</pre>
			<pre>&lt;div class="right"&gt; &lt;!-- Float right any element --&gt;</pre>
			<pre>&lt;div class="center"&gt; &lt;!-- Center align text of any element --&gt;</pre>
			<pre>&lt;div class="hide"&gt; &lt;!-- Hide any element --&gt;</pre>
			<pre>&lt;div class="reset"&gt; &lt;!-- Resets all css of the element --&gt;</pre>
			<pre>&lt;div class="clear"&gt; &lt;!-- Sets clear:both for the element --&gt;</pre>
			<pre>&lt;div class="spacer"&gt; &lt;!-- Adds a breathing space between 2 elements. --&gt;</pre>
		</section>`
    .then(data => new Response(data, { status: 200, headers: { 'content-type': 'text/html' } }));
}

serve((req: Request) => {
  const url = req.url;
  const staticFiles = new StaticFileHandler('static');
  let response: Response = new Response(new Response("Not found", { status: 404 }));

  // Probably only needs to be a static site
  const routes: Array<Route> = [
    [
      new URLPattern({ pathname: "/" }),
      (request, patternResult) => {
        console.log(window.location)
        return render(""); // index
      }
    ],
    [
      new URLPattern({ pathname: "/:framework.html" }),
      (request, patternResult) => {
        const pathname = new URL(request.url).pathname;
        const { framework } = patternResult.pathname.groups;

        if (framework == null) {
          return new Response("Not found", { status: 404 })
        }

        return render(framework);
      }
    ],
    // Fall through.
    [
      staticFiles.pattern,
      staticFiles.handler.bind(staticFiles)
    ]
  ];

  for (const [pattern, handler] of routes) {
    const patternResult = pattern.exec(url);
    console.log(pattern, url, patternResult)
    if (patternResult != null) {
      // Find the first matching route.
      const responseFromHandler = handler(req, patternResult);

      response = responseFromHandler;
      break;
    }
  }

  return response;
});