import { Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/create-order.request';
import { Model } from 'mongoose';
import { Order } from './shemas/order.schema';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository:OrdersRepository
    ){}

  async createOrder(request:CreateOrderRequest){
    return this.ordersRepository.create(request)
  }
  
  async getOrders(){
    return this.ordersRepository.find({})
  }

}
