<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <p>
            For a guide and recipes on how to building apps on ShopBase platform<br>
            check out the
            <a href="https://developers.shopbase.com" target="_blank" rel="noopener">ShopBase Developers</a>.
        </p>
        <div v-if="!domain">
            <h3>Enter your domain</h3>
            <div>
                <div>
                    <input v-model="toInstallDomain" required placeholder="domain.onshopbase.com"/>
                </div>
                <div>
                    <button v-on:click="installApp">Install SampleApp</button>
                </div>
            </div>
        </div>
        <div v-if="domain">
            <h3>Recent orders on your shop ({{ domain }})</h3>

            <p v-if="isLoading">Loading...</p>
            <p v-else-if="orders.length === 0">No orders found!</p>
            <ul v-show="!isLoading">
                <li v-bind:key="order.id" v-for="order in orders">
                    <a target="_blank" :href="'https://' + domain + '/admin/orders/' + order.id">
                        {{order.name}}
                    </a>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
    import Axios from 'axios'
    import Config from '../../config'

    export default {
        name: 'Orders',
        props: {
            msg: String
        },
        data() {
            return {
                isLoading: true,
                orders: [],
                domain: '',
                toInstallDomain: ''
            }
        },
        mounted() {
            const urlParams = new URLSearchParams(window.location.search)
            this.domain = urlParams.get('domain')

            if (this.domain) {
                Axios.get(Config.apiEndpoint + '/orders?shop=' + this.domain).then(res => {
                    this.isLoading = false
                    this.orders = res.data.orders
                })
            }
        },
        methods: {
            installApp() {
                if (this.toInstallDomain) {
                    window.location.href = Config.apiEndpoint + '/auth?shop=' + this.toInstallDomain
                } else {
                    alert('Please provide a ShopBase domain to install SampleApp')
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    input {
        width: 160px;
    }
</style>
