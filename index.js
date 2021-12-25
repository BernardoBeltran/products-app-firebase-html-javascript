const db = firebase.firestore();

const $productForm = document.getElementById('products-form');
const $productsContainer = document.getElementById('products-container');

let editStatus = false;
let id = '';

const saveProduct = (title, price, description) => 
    db.collection('products').doc().set({
        title,
        price,
        description
    });

const getProducts = () => db.collection('products').get();

const getProduct = (id) => db.collection('products').doc(id).get();

const onGetProducts = (callback) => db.collection('products').onSnapshot(callback);

const deleteProduct = id => db.collection('products').doc(id).delete();

const updateProduct = (id, updateProduct) => db.collection('products').doc(id).update(updateProduct);

window.addEventListener('DOMContentLoaded', async (e) => {

    onGetProducts((querySnapshot) => {
        $productsContainer.innerHTML = '';
        querySnapshot.forEach(doc => {

            const product = doc.data();
            product.id = doc.id;
    
            $productsContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
                <h4>${product.title}</h4>
                <h5>US $${product.price}</h5>
                <p>${product.description}</p>
                <div>
                    <input type="button" value="Delete" class="btn btn-danger btn-delete" data-id="${product.id}">
                    <input type="button" value="Edit" class="btn btn-info btn-edit" data-id="${product.id}">
                </div>
            </div>`;

            const btnsDelete = document.querySelectorAll('.btn-delete');
            btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    await deleteProduct(e.target.dataset.id);
                })
            });
            
            const btnsEdit = document.querySelectorAll('.btn-edit');
            btnsEdit.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const doc = await getProduct(e.target.dataset.id);
        
                    const product = doc.data();
                    editStatus = true;
                    id = doc.id;

                    $productForm['product-title'].value = product.title; 
                    $productForm['product-price'].value = product.price; 
                    $productForm['product-description'].value = product.description; 
                    $productForm['btn-product-form'].innerText = 'Update';
                })
            })

        });
    })

})

$productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = $productForm['product-title'];
    const price = $productForm['product-price'];
    const description = $productForm['product-description'];

    if(!editStatus){
        await saveProduct(title.value, parseFloat(price.value), description.value);
    }else{
        await updateProduct(id, {
            title: title.value,
            price: parseFloat(price.value),
            description: description.value
        });

        editStatus = false;

        $productForm['btn-product-form'].innerText = 'Save';

    }


    $productForm.reset();
    title.focus();

});