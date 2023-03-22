console.log("hej")
// hej
let content = document.querySelector("#content");
let header = document.querySelector("#header");


fetch("http://157.230.107.76/index.php/wp-json/wp/v2/pages") 
.then(res => res.json())
.then(data => {
    console.log("pages", data);
})


// tar alla pages som finns o skapar en slaks meny!!
  fetch('http://157.230.107.76/index.php/wp-json/wp/v2/pages')
  .then(response => response.json())
  .then(pages => {

    pages.forEach(page => {
        console.log(page.slug)
        let menuItem = document.createElement("button")
        menuItem.classList.add("MenuButton")
        menuItem.innerText = page.title.rendered
        // menuItem.setAttribute("href", page.link)
        menuItem.addEventListener("click", function() {
            content.innerHTML = '';
            if (menuItem.innerText === "Shop") {
                WoocommerceShop()
            } else if (menuItem.innerText === "Latest News") {
                news()
            }
            else {
                content.innerHTML = page.content.rendered;
            } 
            
            console.log(page.link)
            console.log(page.title.rendered)
        })
        header.appendChild(menuItem)
    });
    
  })

  let cart = [

  ]


//--------------------------------Anton--------------------------------//
function WoocommerceShop() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  fetch("http://157.230.107.76/index.php/wp-json/wc/store/products")
  .then(res => res.json())
  .then(data => {
      console.log("produkter", data);
      printProductList(data);
  })
  
  function printProductList(products) {
    let shopDiv = document.createElement("div");
    shopDiv.classList.add("shopDiv")
      let ul = document.createElement("ul")
      
      products.map(product => {
        let newBtn = document.createElement("button");
        
          let li = document.createElement("li")
          li.classList.add("product")
          li.innerHTML = ` <img class="productImg" src="${product.images[0].src}">
          
          <br> ${product.name} <br> 
          ${product.prices.price} ${product.prices.currency_code}`;
          newBtn.innerText = `Buy now!`
          
          newBtn.addEventListener("click", () => {
            
            let existingShoeIndex = -1;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].product_id === product.id) {
                    existingShoeIndex = i;
                    console.log(cart)
                    break;
                    
                }
            }

            if (existingShoeIndex > -1) {
                cart[existingShoeIndex].quantity += 1; 
            }   
            else {
                let addshoe = {
                product_id: product.id,
                quantity: 1
                }
                cart.push(addshoe)
                console.log(cart)
            }
            localStorage.setItem("cart", JSON.stringify(cart));
          })
          

        
        ul.appendChild(li)
        li.appendChild(newBtn)
      })
      const sendorderBtn = document.createElement("button");
      sendorderBtn.innerText = "Send"
      shopDiv.appendChild(ul)
      content.appendChild(shopDiv)
      content.appendChild(sendorderBtn)
      sendorderBtn.addEventListener("click", postOrder)
      
    }
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
        
    }
    for (let i = 0; i < cart.length; i++) {
        order.line_items.push(cart[i])
    }
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
        localStorage.setItem("cart", JSON.stringify([]));
        printCart();
    })
    .catch(err => console.log("err", err));
}

