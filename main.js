var eventBus = new Vue()

Vue.component('product-details',{
    props: {
        details:{
            type: Array,
            required: true,
            }
        },
    template: `
         <div class='product-details'>
            <p>Our products are always wonderful</p>
         </div>
    `
    
}

)
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class='product-image'>
                <img :src='image'>
            </div>
            <div class="product-info">
                <h1> {{ title }}</h1>
                 <p :class ='{ notOnSale: !onSale}'> {{ saleDetails }}</p> 
                 <span><strong> {{ description }}</strong></span>
                 <p v-if='inStock'>In Stock</p>
                 <!-- Youcan use v-show as well, it keeps the image on the page instead of deleting it -->
                 <!-- <p v-show='inStock'>In Stock</p> -->
                 <!-- <p v-if='inventory > 10'>In stock</p> -->
                <!--<p v-else-if='inventory <= 10 && inventory > 0 '>Almost out ofstock</p> -->
                <p v-else :class='{ outOfStock: !inStock}'>Out of stock</p>  
                <ul>
                    <li v-for='detail in details'>{{ detail }}</li>
                </ul>
                <div class='color-box' 
                    v-for='(variant, index) in variants'
                    :key='variant.variantId'
                    :style = '{backgroundColor : variant.variantColor}'
                    @mouseover='updateProduct(index)'>       
                </div>
                <ul>
                    <li v-for='size in sizes'>{{ size }}</li>
                </ul>
                    <p>{{ variantQuantity }}</p>
                    <p>Shipping is: {{ shipping }}</p>
                <button v-on:click='addToCart()'
                :disabled='!inStock'
                :class='{ disabledButton: !inStock}'>Add to cart</button>
                <button v-on:click='removeFromCart()'>Remove from cart</button> 
            </div>
            
            
            <product-tab :reviews='reviews'></product-tab>
        </div>
         `,
    data() {
        return { 
        brand: 'Vue Mastery',
        product: 'Socks',
        description: 'The best of its kind',
        //image: 'images/greenSocks.jpg',
        onSale: true,   
        selectedVariant: 0,                                                                                                                                                                                                                                                                                                             
        //inStock: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId : 2234 ,
                variantColor : 'green',
                variantImage : 'images/greenSocks.jpg',
                variantQuantity: 40,
            },
            {
                variantId : 2235 ,                                      
                variantColor : 'blue',
                variantImage : 'images/blueSocks.jpg'
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        count : 0,
        reviews: []
        }
    },

    methods: {
        addToCart() {
           this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
       },
       removeFromCart() {
           this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
       },
       updateProduct(index) {
           this.selectedVariant = index
           console.log(index)
       },
   },

   computed: {
    title() {
        return this.brand + ' ' + this.product
    },                                                                                                          
    image() {                                                                
        return this.variants[this.selectedVariant].variantImage; 
    },
    inStock() {
        return  this.variants[this.selectedVariant].variantQuantity
    },
    variantQuantity(){      
        return  this.variants[this.selectedVariant].variantQuantity   
    }, 
    saleDetails(){
        if(this.onSale == true){
            return this.brand + ' ' + this.product + ' ' + 'is on sale'
        }else{
            return this.brand + ' ' + this.product + ' ' + 'not on sale'
        }
    },
    shipping(){
        if(this.premium){
            return 'free'
        }else{
            return 5000;
        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
           })
       }
}

})

Vue.component('product-review',{
    template: `

        <form class='review-form' @submit.prevent = 'onSubmit'>
            <p class='error' v-if='errors.length'>
                <b  class='errorRed'>Attention Please !!!</b>
                <ul>
                    <li v-for='error in errors'>{{ error }}</li>
                </ul>
            </p>
             <p><label for='name'> Name :</label>
                <input id='name' v-model.trim='name' placeholder='Enter your name'>
             </p>
             <p><label for='review'> Comment :</label>
                <textarea id='review' v-model='review'></textarea>
             </p>
            <p><label for='name'> Rating :</label>
               <select id='rating' v-model.number='rating'>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
               </select>
            </p>
            <p>
               <strong><i class='recommendationColor'>Would you recommend this product ?</i></strong>
            </p>
            <label class='radio-inline'>   
               <input type='radio' v-model='check' class='radioDisplay' name='name' value='yes' checked>Yes
            </label>
            <label class='radio-inline'>
               <input type='radio' v-model='check' class='radioDisplay' name='name' value='No'>No
            </label>
            <p>
               <input type='submit' value='Submit'></input>
            </p>
        </form>
      
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            check: null,
            errors: []
        }
    },
    methods: {
         onSubmit() {
             if(this.name && this.review && this.rating && this.check){
                let productReview = {
                    name : this.name,
                    review: this.review,
                    rating: this.rating,
                    check: this.check,
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null,
                this.review = null,
                this.rating = null,
                this.check = null
            }else{
                if(!this.name)
                    this.errors.push('Name is required')
                if(!this.review)
                    this.errors.push('Review is requred')
                if(!this.rating)      
                    this.errors.push('Rating is required')
                if(!this.check)
                this.errors.push('Please your recommendation is needed')
            }
             
         }
    }
})

Vue.component ('product-tab', {
    props: {
       reviews: {
          type: Array,
          required: false,
       }
       
    },
    template: `
       <div>
         <ul>
         <span class='tabs' 
          v-for='(tab, index) in tabs'
           @click = 'selectedTab = tab' :key = 'index'
           :class = '{ activeTab : selectedTab === tab}'>{{ tab }}</span>
         </ul> 
         <div v-show="selectedTab==='Review'">
                <strong v-if='!reviews.length'><i>No review(s) yet</i></strong>
                <ul>
                    <li v-for='review in reviews'>
                        <p>Name: &nbsp;{{ review.name }}</p>
                        <p>Comment: &nbsp;{{ review.review }}</p>
                        <p>Rate: &nbsp;{{ review.rating }}</p>
                    </li>
                    
                </ul>
         </div>
            <product-review v-show="selectedTab===' Make a review'"></product-review>
       </div>
    `,
    data() {
        return{
            tabs: ['Review',' Make a review'],
            selectedTab: 'Review',
        }
    }
})

var app = new Vue ({
    el: '#app',
    data: {
        premium : false,
        details : [],
        cart : []
    },
    methods: {
        updateCart(id){
            this.cart.push(id)
        },
        updateCartRemove(id){
            this.cart.shift(id)
        }
    }

})