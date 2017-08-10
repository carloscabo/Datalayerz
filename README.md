# Datalayerz
Google Tag Manager (GTM) and datalayer events and variables manager.

# Requirements

- jQuery 1.7.1+
- You must have your GTM [correctly integrated with yout project](https://developers.google.com/tag-manager/quickstart).
- If you must give support to IE9 / IE10 you must add the [MutationObserver polyfill](https://github.com/megawac/MutationObserver.js/tree/master)

# Usage

Include the JS library `datalayerz.js` in your project.

Add `data-datalayer` attributes on those **elements that you want to be binded** to common events ( _click, change, ..._ ).

The `data-datalayer` must contain a **[valid JSON string](https://jsonlint.com/)** that will define all the datalayer variables that will be sent and the **triggering event**:

````
data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"Search"}]'
````

As you can see in the sample **the JSON object is an array**. This allows you to attach **several events to the same html element**.

````html
<!-- Binding 2 events (click, change) to the same element -->
<select name="lang" id="main-lang" data-datalayer='[{"trigger":"change", "eventCategory":"Category1", "eventAction":"Language changed"}, {"trigger":"click", "eventCategory":"Category2", "eventAction":"Open lang selector"}]'>
  <option value="ES">ES</option>
  <option value="EN">EN</option>
````

# Samples

## 1. Binding a simple click event

The easiest GTM event binding, on `click` the variables `eventCategory` and `eventAction` will be added to the datalayer with its corresponding values.

````html
<div class="actions">
  <ul>
    <li class="search" data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"Show search"}]' >
      <img src="search.png" alt="Search icon">
    </li>
    <!-- ... -->
````

## 2. Binding two (or more) events

As seen before, simple add more objects to the array.

````html
<!-- Passing 2 events (click, change) to the same element -->
<select name="lang" id="main-lang" data-datalayer='[{"trigger":"change", "eventCategory":"Category1", "eventAction":"Language changed"}, {"trigger":"click", "eventCategory":"Category2", "eventAction":"Open lang selector"}]'>
  <option value="ES">ES</option>
  <option value="EN">EN</option>
````

## 3. Sending information from the html tag itself

You can send some information from an element passing an string containing a _jQuery selector_ that will be evaluated when the event is triggered. Refer to the **element itself using the `$(el)`** _magic selector_ :smiley:

Imagine that tou want to send a GTM variable **when user changes the language of the application.** You can set a `data-datalayer` attribute this way:

````html
<!-- Passing 2 events (click, change) to teh same element -->
<select name="lang" id="main-lang" data-datalayer='[{"trigger":"change", "eventCategory":"Category1", "eventAction":"Language changed", "eventLabel":"$(el).val()"}]'>
  <option value="ES">ES</option>
  <option value="EN">EN</option>
````

Sending the text of a link its very easy too:

````html
<a href="#" id="btn" data-datalayer='[{"trigger":"click", "eventCategory":"Category", "eventAction":"Action", "eventLabel":"$(el).text()"}]'>Text of the link</a>
````

And you can even send the content of any other attribute present in the element this way ( even _data-attr_ ):

````html
<a href="#" id="btn" data-datalayer='[{"trigger":"click", "eventCategory":"Category", "eventAction":"Action", "eventLabel":"$(el).attr(\"id\")"}]'>Text of the link</a>
````

| :warning: **Notice** |
| :--- |
| For security reasons you can **execute a reduced subset of jQuery functions only!**: `.text()`, `.val()`, `.attr( \"attribute\" )`, `.data( \"identifier\" )` |

## 4. Sending information from other elements in the page

Use a valid jQuery selector on the JSON to target other elements in the page

````html
<input id="my-field" value="1123">
<a href="#" data-datalayer='[{"trigger":"click","eventCategory":"Category", "eventAction":"Action","eventLabel":"$(\"my-field\").val()"}]'>Send input value</a>
````

## 5. Sending information present in the datalayer of the page

Sometimes you may need to send some **information already present in the datalayer declaration** that is defined in the header of the page.

````html
<!-- Typical datalayer declaration in the page's <head> -->
<head>
<script>
  dataLayer = [{
    'page.name': 'Name of the page',
    'channel': 'web',
    'environment.type': 'public',
    //....
````

For sending any of this parameters / variables pass them surrounded by _double brackets_: `{{page.name}}`

````html
<a href="#" data-datalayer='[{"trigger":"click","eventCategory":"Category", "eventAction":"Action","eventLabel":"{{page.name}}"}]'>Send input value</a>
````

## 6. Calling a public function in the page to send the returned information

Yo can define a public function in your app and send the value returned by the function as param.

````html
<script>
  // Be sure the function is global and if defined BEFORE calling it
  window.my_function = function() {
    return (new Date()).toString();
  }
````

Bind the funtion to the event this way:

````html
<a href="#" data-datalayer='[{"trigger":"click", "eventCategory":"Category", "eventAction":"Action", "eventLabel":"window.my_function"}]'>Send time of click</a>
````

Public function may always begin with `window.`. An Easy way to see if you function is working fine its call it from the web browser console `windowwindow.my_function();`

## 7. Make children elements to _inherit_ the event of its parent

Sometimes you need that **all the children elements of one container element behave exactly the same way.** To avoid repeat again and again the same `data-datalayer` attributes / settings you can use the special data-attr `data-datalayer-children`.

In the following sample all the children ( **direct descendants!** ) of the `<ul>` element send the link text.

````html
<ul class="main-nav" data-datalayer-children='[{"trigger":"click", "eventCategory":"Menu","eventAction":"$(el).text()"}]' >
  <li class="active"><a href="">Compañía</a></li>
  <li><a href="">Actividad</a></li>
  <li><a href="">Sostenibilidad</a></li>
  <li><a href="">Tecnología</a></li>
  <li><a href="">Personas y talento</a></li>
</ul>
````

This is equivalent to:

````html
<ul class="main-nav">
  <li class="active" data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"$(el).text()"}]'><a href="">Compañía</a></li>
  <li data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"$(el).text()"}]'><a href="">Actividad</a></li>
  <li data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"$(el).text()"}]'><a href="">Sostenibilidad</a></li>
  <li data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"$(el).text()"}]'><a href="">Tecnología</a></li>
  <li data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"$(el).text()"}]'><a href="">Personas y talento</a></li>
</ul>
````

# More interesting or advanced samples

Sending the **text** (not the value) of the current selected option in a select.

````html
<select id="my-select" data-datalayer='[{"trigger":"change","eventCategory":"Módulo de mapa","eventAction":"Filtro de actividades mapa","eventLabel":"$(\"#my-select option:selected\").text()"}]' >
  <optgroup>
    <option value="">Select option</option>
    <option value='["ES","IT","PT"]'>European countries</option>
`````

---



# Troubleshooting

# Changelog