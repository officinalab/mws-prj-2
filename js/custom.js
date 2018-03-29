// link to filter (skip-map and return to top)
function goto(element){
    const target = document.getElementById(element);
    window.scrollTo(0, target.offsetTop - 50);
    target.focus();
  }

  const gotofilter = document.getElementById('gotofilter');
  gotofilter.addEventListener('click', function(event){
      event.preventDefault();
      element = this.getAttribute('href').slice(1);
      goto(element);
  });
  gotofilter.addEventListener('keyup',function(event){
    event.preventDefault();
    if(event.keyCode == "13" || event.keyCode == "32"){ // 13 == enter 32 ==  space
      element = this.getAttribute('href').slice(1);
      goto(element);
    }
    return false;
  });
