import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterConfigOptions } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';


@Component({
  selector: 'app-product-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ){

  }

  ngOnInit(): void {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas() {
    const productsLoaded = this.productsDtService.getProductsDatas();

    if(productsLoaded.length > 0) {
      this.productsDatas = productsLoaded
    } else {
      this.getAPIProductsData();
    }

    console.log('Dados de produtos', this.productsDatas);

  }
  getAPIProductsData() {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({next: (response) => {
      if(response.length > 0){
        this.productsDatas = response;
      }
    },error: (err)=> {
      console.log(err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Erro ao buscar produtos',
        life: 2500
      })
      this.router.navigate(['/dashboard'])
    }})
  }

 ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete;  
 }

}
