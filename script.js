window.onload = homeTest();
console.log("hej")
// hej
let content = document.querySelector("#content");
let header = document.querySelector("#header");
let shopDiv = document.createElement("div");
let formData = {};

fetch("http://157.230.107.76/index.php/wp-json/menus/v1/menus/")
  .then(res => res.json())
  .then(data => {
    console.log("menus", data[1].name);
    let test = data[2].name;
    let url = `http://157.230.107.76/index.php/wp-json/menus/v1/menus/${test}`;
    fetch(url) 
      .then(res => res.json())
      .then(data => {
        
        for (let i = 0; i < data.items.length; i++) {
          const MenuButton = document.createElement("button");
          MenuButton.innerText = data.items[i].slug;
          MenuButton.classList.add(`${data.name}MenuItem`);
          
          MenuButton.innerText = data.items[i].title;
          header.appendChild(MenuButton);
          MenuButton.addEventListener("click", function() {
            content.innerHTML = '';
            if (MenuButton.innerText === "Shop") {
      
              categoryMenu();
              WoocommerceShop();
            } else if (MenuButton.innerText === "Latest News") {
              console.log(cart);
              news();
            } else if (MenuButton.innerText === "Home") {
              console.log("reeee");
              homeTest();
            } else if (MenuButton.innerText === "Cart") {
              printTheCart();
              
            } else if (MenuButton.innerText === "Checkout") {
              printCheckout();
            }else {
              
            } 
          });
     
        }
      });
  });

  //--------------Footer---------------//
  fetch("http://157.230.107.76/index.php/wp-json/menus/v1/menus/") 
.then(res => res.json())
.then(data => {

    console.log("menus", data[1].name);
    let test = data[1].name;
    let url = `http://157.230.107.76/index.php/wp-json/menus/v1/menus/${test}`
    fetch(url) 
    .then(res => res.json())
    .then(data => {

      console.log(data)
      for (let i = 0; i < data.items.length; i++) {
        
        const MenuButton = document.createElement("button");
        MenuButton.innerText = data.items[i].slug;
        MenuButton.classList.add(`${data.name}MenuItem`)
        footer.appendChild(MenuButton)
        MenuButton.innerText = data.items[i].title
        MenuButton.addEventListener("click", function() {
          content.innerHTML = '';
          
          if (MenuButton.innerText === "Contact us") {
            contactWEE();
          } else if (MenuButton.innerText === "Refund & Returns Policy"){
            refundReturn();
          } else if (MenuButton.innerText === "About us!") {
            omOss();
          
          }
        })
      }
    
})
})
function contactWEE() {
  fetch("http://157.230.107.76/index.php/wp-json/wp/v2/pages?slug=contactus")
  .then(res => res.json())
    .then(data => {
      const contactUs = data[0];
      content.innerHTML = contactUs.content.rendered
    })
};

function refundReturn() {
  fetch("http://157.230.107.76/index.php/wp-json/wp/v2/pages?slug=refund_returns")
  .then(res => res.json())
    .then(data => {
      const refundR = data[0];
      content.innerHTML = refundR.content.rendered
    })
};

function omOss() {
  fetch("http://157.230.107.76/index.php/wp-json/wp/v2/pages?slug=om-oss")
  .then(res => res.json())
    .then(data => {
      const oss = data[0];
      content.innerHTML = oss.content.rendered
    })
};

  //--------------------------------Andre--------------------------------//

  let cart = JSON.parse(localStorage.getItem("cart")) || []; // laddar cart från lokal eller skapar arrayen


  function printTheCart() {
    let totalPrice = 0;
  
    if (cart.length === 0) {
      content.innerHTML = "<h1>Your cart is empty.</h1>";
    } else {
      content.innerHTML = "<h1>These are the products in your cart:</h1>";
  
      for (let i = 0; i < cart.length; i++) {
        let productName = cart[i].product_name;
        let productQuantity = cart[i].quantity;
        let productPrice = cart[i].price;
        let productCurrency = cart[i].price_currency;
        let productImage = cart[i].product_images;
        let productString = `<img src="${productImage}" width="100" height="100"> ${productQuantity} pair/s | ${productName}: ${productPrice} ${productCurrency} each`;
        
        content.innerHTML += productString + "<br>";
        
  
        totalPrice += productPrice * productQuantity;
      }
  
      content.innerHTML += `<br><h2>Total price: ${totalPrice} ${cart[0].price_currency}</h2>`;
  
      let clearBtn = document.createElement("button");
      clearBtn.innerText = "Clear Cart";
      content.appendChild(clearBtn);
      let checkoutbtn = document.createElement("button");
      checkoutbtn.innerText = "Proceed to Checkout";
      content.appendChild(checkoutbtn);
      checkoutbtn.addEventListener("click", () => {
        printCheckout();
      });
      clearBtn.addEventListener("click", () => {
        cart = [];
        localStorage.clear();
        content.innerHTML = "<h1>Your cart is empty.</h1>";
      });

    }
  }



function homeTest() {
    fetch("http://157.230.107.76/index.php/wp-json/wp/v2/pages?slug=home")
     .then(res => res.json())
      .then(data => {
      const homepage = data[0];
        content.innerHTML = homepage.content.rendered;
      
        // antons knas
       const shopButton = document.querySelector(".shopButton")
       shopButton.remove();
       const newShopbtn = document.createElement("button")
       newShopbtn.classList.add("shopButton")
       newShopbtn.innerText = "Shop!"
       newShopbtn.onclick = function() {
        content.innerHTML = '';
        categoryMenu();
        WoocommerceShop();
       }
       const imgtext = document.querySelector(".IMG_paragraph")
       imgtext.appendChild(newShopbtn)
     });
  }
  

  function printCheckout() {
    content.innerHTML = "";
    if (cart.length === 0) {
        content.innerHTML = "<h1>Your cart is empty.</h1>";
      } else {
        
    const form = document.createElement('form');
    const h2 = document.createElement('h2');
    h2.textContent = 'Your information!';
    
    form.appendChild(h2);
    
    const labels = ['first_name', 'last_name', 'adress_1', 'city', 'postcode', 'country', 'email', 'phone'];
    
    labels.forEach(labelName => {
      const label = document.createElement('label');
      label.textContent = labelName;
  
      const input = document.createElement('input');
      input.id = labelName;
      input.name = labelName;
  
      form.appendChild(label);
      form.appendChild(input);
      form.appendChild(document.createElement('br'));
    });
  
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Send';
  
    form.appendChild(submitButton);
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      // lägger till value i objekt
      labels.forEach(labelName => {
        const input = document.getElementById(labelName);
        formData[labelName] = input.value;
      });
  
   
      postOrder();
    });
  
    content.appendChild(form);
  }
}

    //--------------------------------Slut Andre--------------------------------//


    let arrtest = []
    let fortnite = "";
     function printCatagory() {
      
      fetch("http://157.230.107.76/index.php/wp-json/wc/store/products")
      .then(res => res.json())
      .then(data => {
         
        for (let i = 0; i < data.length; i++) {

          if (data[i].categories[0].slug === fortnite) {
            arrtest.push(data[i])
            console.log(arrtest)
          } 
          
        }
        printProductList(arrtest)
      })
    }

// skapar meny knapparna på shop sidan
function categoryMenu() {
  shopDiv.innerHTML = ''
  console.log("1")
  const categoryMenu = document.createElement("div");
  categoryMenu.classList.add("categoryMenu")
    fetch("http://157.230.107.76/index.php/wp-json/menus/v1/menus/category") 
    .then(res => res.json())
    .then(data => {
      
      console.log("1")
      const allProductsButton = document.createElement("button");
      allProductsButton.innerText = "All Products";
      categoryMenu.appendChild(allProductsButton);
      allProductsButton.addEventListener("click", function() {
        WoocommerceShop()
      });
      for (let i = 0; i < data.items.length; i++) {
        
        const MenuButton = document.createElement("button");
        MenuButton.innerText = data.items[i].slug;
        MenuButton.classList.add(`${data.name}MenuItem`)
        categoryMenu.appendChild(MenuButton)
        content.appendChild(categoryMenu)

        MenuButton.addEventListener("click", function() {
          fortnite = MenuButton.innerText
          
          printCatagory()
          arrtest = []
        })
      }
    
})
}



//--------------------------------Anton--------------------------------//


function WoocommerceShop() {

  fetch("http://157.230.107.76/index.php/wp-json/wc/store/products")
  .then(res => res.json())
  .then(data => {
      console.log("produkter", data);
      
      printProductList(data);

  })  
}
function printProductList(products) {
  
  shopDiv.innerHTML = ''
  shopDiv.classList.add("shopDiv");
  let ul = document.createElement("ul");

  let quantityP = document.createElement("p"); //ANDRE THE BEAST

  products.map(product => {
    let newBtn = document.createElement("button");
    let li = document.createElement("li");
    li.classList.add("product");
    li.innerHTML = ` <img class="productImg" src="${product.images[0].src}">
      
      <br> ${product.name} <br> 
      ${product.prices.price} ${product.prices.currency_code}`;
    newBtn.innerText = `Buy now!`;

    newBtn.addEventListener("click", () => {
      console.log(cart);
            
      let existingShoeIndex = -1;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].product_id === product.id) {
          existingShoeIndex = i;
          break;
        }
      }

      if (existingShoeIndex > -1) {
        cart[existingShoeIndex].quantity += 1; 
      }   
      else {
        let addshoe = {
          product_id: product.id,
          quantity: 1,
          product_name: product.name,
          price: product.prices.price,
          price_currency: product.prices.currency_code,
          product_images: product.images[0].src,
        };
        cart.push(addshoe);
        existingShoeIndex = cart.length - 1;
      }
      localStorage.setItem("cart", JSON.stringify(cart)); // ANDRE THE BEAST
  
      quantityP.innerText = `Currently ${cart[existingShoeIndex].quantity} in cart.`; // ANDRE THE BEAST

      li.appendChild(quantityP); //ANDRE THE BEAST
    });

    ul.appendChild(li);
    li.appendChild(newBtn);
  });
  
  shopDiv.appendChild(ul);
  
  content.appendChild(shopDiv);
  
  
  
}


function news() {
    fetch("http://157.230.107.76/index.php/wp-json/wp/v2/posts")
        .then(res => res.json())
        .then(data => {
            console.log("posts", data);

            data.forEach(post => {

                const newsdiv = document.createElement("div");
                newsdiv.classList.add("newsPost")
                newsdiv.innerHTML = `<h2>${post.title.rendered}</h2>${post.content.rendered}`
                content.appendChild(newsdiv)
            });
        })
}


//--------------------------------Anton--------------------------------//
  
function postOrder() {
    console.log("Skicka order");
    
    // SKAPA BODY
    let order = {
        payment_method: "bacs", 
        payment_method_title: "Direct Bank Transfer",
        set_paid: true,
        customer_id: 1,
        billing: {
            first_name: "Janne",
            last_name: "Kemi",
            adress_1: "Gatan 10",
            city: "Uddebo",
            postcode: "514 92",
            country: "SE",
            email: "janne@hiveandfive.se",
            phone: "070123456"
        },
        shipping: {
            first_name: "Janne",
            last_name: "Kemi",
            adress_1: "Gatan 10",
            city: "Uddebo",
            postcode: "514 92",
            country: "SE",
            email: "janne@hiveandfive.se",
            phone: "070123456"
        },
        line_items: [    
        ],
        shipping_lines: [
            {
                method_id: "flat_rate",
                method_title: "Flat rate",
                total: "100"
            }    
        ],
        
    };

    let billing = order.billing;
    let shipping = order.shipping;
    
  



    for (let i = 0; i < cart.length; i++) {
        order.line_items.push(cart[i])
    }

    


    //ANDRE THE BEAST byter ut nurvarande value i objekten
    for (let key in formData) {
        billing[key] = formData[key];
        shipping[key] = formData[key];
    }

    console.log(order);

    fetch("http://157.230.107.76/index.php/wp-json/wc/v3/orders", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(order),
    })
    .then(res => res.json())
    .then(data => {
        console.log("Order skickad", data);
    })
    .catch(err => console.log("err", err));

    cart = [];//ANDRE THE BEAST
    localStorage.clear();
    content.innerHTML = "<h1>Your order has been placed!</h1>"; //ANDRE THE BEAST
}
