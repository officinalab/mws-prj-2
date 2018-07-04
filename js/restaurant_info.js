let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      console.log(restaurant);
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage

 <img srcset="
  /images/1-small_small.jpg 270w,
  /images/1-medium_medium.jpg 400w,
  /images/1-large_large.jpg 768w,
  /images/1-xlarge_xlarge.jpg 1000w"
     src="elva-fairy-800w.jpg" alt="Elva habillée en fée">


 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  console.log("fill: ",restaurant);


  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;


  if(typeof restaurant.photograph != 'undefined' && restaurant.photograph != ""){
    function createSrcs(str) {
      let labels = new Array();
      labels[ "small"] = 270;
      labels[ "medium"] = 460;
      labels[ "large"] = 768;
      labels[ "xlarge"] = 1000;

      let listSrc = new Array();
      const idx = image.src.indexOf(".");
      for(let label in labels){
        listSrc.push(`${str.slice(0, idx)}-${label}_${label}${str.slice(idx)} ${labels[label]}w`);
      }
      return listSrc.join();
    }

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute('srcset', createSrcs(image.src) );
    image.setAttribute('sizes','(min-width: 769px) 50vw, 100vw' );
    image.setAttribute('alt', `${restaurant.name}, ${restaurant.cuisine_type} restaurant in ${restaurant.neighborhood}.` );
  }


  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('div'); //tr
    row.setAttribute("role","row");
    row.setAttribute("aria-label",`Hours on`);

    const day = document.createElement('span');
    day.innerHTML = key;
    day.setAttribute("role","columnheader");
    row.appendChild(day);

    const time = document.createElement('span');
    time.innerHTML = operatingHours[key];
    time.setAttribute("role", "cell");
    row.appendChild(time);
    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.classList.add("review-customer");
  name.innerHTML = review.name;
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.classList.add("review-rating");
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const date = document.createElement('p');
  date.classList.add("review-date");
  date.innerHTML = review.date;
  li.appendChild(date);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute("aria-current","page");
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
