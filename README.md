# Datalayerz
Google Tag Manager (GTM) and datalayer events and variables manager.

# Requirements

- jQuery 1.7.1+

You must have your GTM correctly integrated with yout proyect. Please read carefully hot yo properly add GTM to your proyect.

# Usage steps

Include the JS library ( `datalayerz.js` ) in your project.

Add a `data-datalayer` attribute on those elements that you want to be binded to common events ( _click, change, ..._ ).

The `data-datalayer` must contain a **valid JSON string** that will define all the datalayer variables that will be sent and the **triggering event** also:

````
data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"Search"}]'
````

As you can see in the sample the JSON object is an array. This allows you to attach several events to the same html element, that may be useful some times.

````html
<!-- Passing 2 events (click, change) to teh same element -->
<select name="lang" id="main-lang" data-datalayer='[{"trigger":"change", "eventCategory":"Category1", "eventAction":"Language changed"}, {"trigger":"click", "eventCategory":"Category2", "eventAction":"Open lang selector"}]'>
  <option value="ES">ES</option>
  <option value="EN">EN</option>
````

# Samples

## 1. Binding a simple click event

The easiest GTM event binding:

````html
<div class="actions">
  <ul>
    <li class="search" data-datalayer='[{"trigger":"click","eventCategory":"Menu","eventAction":"Show search"}]' >
      <img src="search.png" alt="Search icon">
    </li>
    <!-- ... -->
````

## 2. Binding two events

````html
<!-- Passing 2 events (click, change) to teh same element -->
<select name="lang" id="main-lang" data-datalayer='[{"trigger":"change", "eventCategory":"Category1", "eventAction":"Language changed"}, {"trigger":"click", "eventCategory":"Category2", "eventAction":"Open lang selector"}]'>
  <option value="ES">ES</option>
  <option value="EN">EN</option>
````

## 3. Sending information from the html tag itself or other elements in page

You can send some information from an element passing an string containing a _jQuery selector_ that will be evaluated when the event is triggered.

You can refer to the element itself using the `$(el)` selector.

Imagine that tou want to send a GTM variaable when user changes the language of the application. You can add a `data-datalayer` as follows:

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

And you can even send the content of any other attribute present in the element this way ( even another data-attr ):

````html
<a href="#" id="btn" data-datalayer='[{"trigger":"click", "eventCategory":"Category", "eventAction":"Action", "eventLabel":"$(el).attr(\"id\")"}]'>Text of the link</a>
````

| :warning: **Notice** |
| :--- |
| For security reasons you can execute a reduced subset of jQuery functions only!
- .text()
- .val()
- .attr( "attribute" )
- .data( "identifier" )

|