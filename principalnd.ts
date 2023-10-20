import { Component, OnInit, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController, Platform, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { AppConstants } from '../../../services/app-constants.service';
import { BankService } from '../../../services/bank.service';
import { HubService } from '../../../services/hub.service';
import { MessageSGB } from '../../../shared/MessageSGB';
import { GlobalUtils } from '../../../shared/util/global-utils';
import { SessionUtils } from '../../../shared/util/session';
import { SgbLogic } from '../../../shared/util/sgblogic';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HomePage } from '../home/home.page';
import { NavigatePage } from '../../../shared/util/NavigatePage';
import * as $ from 'jquery';
import { CuentaPage } from '../cuenta/cuenta.page';
import { ContactoPage } from '../../../contacto/contacto.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SucursalesPage } from '../../../sucursales/sucursales.page';
import { TarjetaPage } from '../tarjeta/tarjeta.page';
import { TarjetasPage } from '@app/tarjetas/tarjetas.page';
import { Storage } from '@ionic/storage';
import { PrestamosPage } from '../../../prestamos/prestamos.page';
import { PagosPage } from '../../../pagos/pagos.page';
import { TransferenciasPage } from '../../../transferencias/transferencias.page';
import { FavoritosPage } from '@app/favoritos/favoritos.page';
import { FavoritePush } from '@app/services/interfaces/favoritos.interfaces';
import { DesktopService } from '@app/services/desktop.service';
import { DesktopObject } from '@app/services/interfaces/desktopObject.interface';
import { environment } from 'src/environments/environment';
import { NotificacionService } from '@app/services/notificacion.service';
import { Notificacion } from '@app/services/interfaces/notificacion.interface';
import { ProductsService } from '../../services/products.service';
import * as _ from 'underscore';
import { CertificadosPage } from '@app/certificados/certificados.page';
import { element } from 'protractor';
import { CuentasService } from '@app/services/cuentas.service';
import { PrincipalPage } from '../../../principal/principal.page';
import { Products } from '@app/newdesign/interfaces/products';
import { Alerts } from '@app/newdesign/interfaces/alerts';
import { TransferenciaPage } from '../transferencia/transferencia.page';
import { Console } from 'console';
import { ApplePayService } from '@app/newdesign/services/apple-pay.service';
import { TemplatesComponent } from '@app/newdesign/components/templates/templates.component';
import { FavoritosRecurrentesPage } from '../favoritos-recurrentes/favoritos-recurrentes.page';
import { ExtracashService } from '@app/newdesign/services/extracash.service';
import { ExtracashPage } from '../extracash/extracash.page';
import { SgbProductCardConfig } from '@app/newdesign/interfaces/sgb-product-card-config';
import { image } from 'ngx-editor/schema/nodes';
import { off } from 'process';
import { Bitacoras } from '@app/newdesign/pages/extracash/services/extracash.enums';
import { BitacoraDescription } from '@app/newdesign/pages/extracash/services/extracash.enums';
import { PreApprovedProducts } from '@app/newdesign/pages/extracash/models/extracash.interface';
import { Offers } from '@app/newdesign/pages/extracash/models/extracash.interface';
import { extracashData } from '@app/newdesign/pages/extracash/models/extracash.interface';

import { FavoritosService } from "@app/newdesign/services/favoritos.service";
import { TransactionService } from "@app/newdesign/services/transaction.service";
import { PagosService } from "@app/newdesign/services/pagos.service";
import { Subscription } from "rxjs";
import { OnboardingCEService } from "@app/newdesign/services/onboarding-ce.service";
import { OptionsPage } from '@app/options/options.page';
import { SessionBankService } from "@app/newdesign/services/session-bank.service";
import { MensajeService } from "@app/services/mensaje.service";
import { CertificadoPage } from '../certificado/certificado.page';
import { PagoConfigPage } from '../pago-config/pago-config.page';
import { ContainerImageSecurityPage } from '../container-image-security/container-image-security.page';
import { PrestamoPage } from '../prestamo/prestamo.page';
//Prueba de cambio a merge

@Component({
  selector: 'app-principalnd',
  templateUrl: './principalnd.page.html',
  styleUrls: ['./principalnd.page.scss'],
})
export class PrincipalndPage implements ViewDidEnter, ViewWillEnter {
  @ViewChild('parentTemplate') parentTemplate: TemplatesComponent;

  static path = 'newdesign/principalnd';
  public show: boolean = false;
  public vissiblextra = false; 
  //public productos: any = this.sgbLogic.productos;
  readonly FF_TCC = environment.tcc;
  readonly FF_PAGOS = environment.pago;
  readonly FF_EXTRACASH = environment.extracash;
  readonly FF_ONBOARDINGCE = environment.onboarding2;
  readonly FF_CERTIFICADOS = environment.certificados;
  readonly FF_PRESTAMOS = environment.prestamos;
  readonly FF_FAVORITE = environment.favorite;

  public iconName = 'points-gris.png';
  URI_JPEG_HEADER = 'data:image/jpeg;base64,';
  public showBanner = false;
  public PreApprovedProducts: PreApprovedProducts;
  public extracashData: Array<extracashData> = [];
  public showExtracash: boolean = false;
  public showOnboardingCE: boolean = false;
  public onboardingCEProduct: any;

  public listProductos = [
    {
      tipo: 'CC',
      nombre: 'Cuentas',
      css: 'pr-cuenta',
      img: 'cuentas.png',
      path: CuentaPage.path,
      show: true,
    },
    {
      tipo: 'TC',
      nombre: 'Tarjetas',
      css: 'pr-tarjeta',
      img: 'tarjetas.png',
      path: TarjetaPage.path,
      show: true,
    },
    {
      tipo: 'PR',
      nombre: 'Préstamos',
      css: 'pr-prestamo',
      img: 'prestamos.png',
      path: PrestamosPage.path,
      show: true,
    },
    {
      tipo: 'CD',
      nombre: 'Certificados',
      css: 'pr-certificado',
      img: 'inversiones.png',
      path: CertificadosPage.path,
      show: true,
    },
  ];
  public mostrar = null;
  public vissible = false;
  private styleJ7 = '';

  private procesando: boolean = false;
  listPage: DesktopObject;
  private showextracash: boolean = false;
  private subscription: Subscription;

  constructor(
    public navigatePage: NavigatePage,
    public plt: Platform,
    private appConstants: AppConstants,
    private callNumber: CallNumber,
    private globalUtils: GlobalUtils,
    private sessionUtils: SessionUtils,
    private sgbLogic: SgbLogic,
    private bankService: BankService,
    public keyboard: Keyboard,
    public statusBar: StatusBar,
    public hubService: HubService,
    private messageSGBB: MessageSGB,
    private desktopService: DesktopService,
    public notificacion: NotificacionService,
    public productsService: ProductsService,
    private cuentasService: CuentasService,
    private messageSGB: MessageSGB,
    private applePayService: ApplePayService,
    public extracashService: ExtracashService,
    private secureStorage: Storage,
    private pagoService: PagosService,
    private favoritosService: FavoritosService,
    private transactionServices: TransactionService,
    private pagosService: PagosService,
    private onboardingServiceCe: OnboardingCEService,
    private modalController: ModalController,
    private sessionBankService: SessionBankService,
    private msgService: MensajeService
  ) {
    this.subscription = new Subscription();
    // this.styleJ7="styleAll";
    // this.resetAnimations();
    //console.log("listProductos", this.listProductos);
  }

  async ngOnInit() {
    this.favoritosService.getFavoritosV2(false);
    this.transactionServices.obtenerBancosDestinov2(
      this.appConstants.ultSecuenciaEncriptada,
      'bancos'
    );
    if (this.FF_PAGOS) {
      this.pagosService.getMenuV2(this.appConstants.ultSecuenciaEncriptada);
      this.pagoService.getSubMenuNew(
        this.appConstants.ultSecuenciaEncriptada,
        'TC',
        false
      );
      this.pagoService.getSubMenuV2(
        this.appConstants.ultSecuenciaEncriptada,
        'PR',
        false
      );
      this.pagoService.getSubMenuV2(
        this.appConstants.ultSecuenciaEncriptada,
        'SV',
        false
      );
      this.pagoService.getSubMenuV2(
        this.appConstants.ultSecuenciaEncriptada,
        'RC',
        false
      );
      this.pagoService.getBillersData(this.appConstants.ultSecuenciaEncriptada);
      this.pagoService.menuPagosSelected = undefined;
    }

    // setTimeout(()=> this.navigatePage.push(ContainerImageSecurityPage.path, {}),3000);
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
  private async hasUserIndicatedNotInterested(): Promise<boolean> {
    const userId = this.PreApprovedProducts?.customer?.id;
    const userName = this.appConstants?.usrName;
    const extracashUsers: Array<extracashData> =
      (await this.secureStorage.get('ExtracashData')) ?? [];
    if (!extracashUsers) return false;
    const validate = extracashUsers.filter(
      (user) => user.extracashId == userId && user.userName == userName
    );
    if (validate.length > 0) return true;
    return false;
  }

  async fetchOffers() {
    await this.extracashService
      .getHasPreapprovedProducts()
      .then(async (result) => {
        this.showExtracash = true;
        this.PreApprovedProducts = result['Data'];
        this.parentTemplate.preApprovedProducts = this.PreApprovedProducts;
      })
      .catch((error) => {
        this.showExtracash = false;
        console.error(
          'Error al llamar al método getHasPreapprovedProducts:',
          error
        );
      });
  }

  async modalOffers() {
    if (await this.hasUserIndicatedNotInterested()) return;
    this.globalUtils.confirmModalNd(
      //muestra el modal de forma normal
      '',
      '',
      '',
      this.PreApprovedProducts?.BOTON,
      '',
      async (data) => {
        //Ir Ahora

        if (data.close) this.goExtracash();
        if (!data.close) this.notShowOffers();
      },
      'sgb-alert-medium sgb-alert sgb-alert-medium__button-cancel modal-extracash',
      this.parentTemplate?.extraCash,
      false,
      true,
      'modal-header-extracash',
      this.PreApprovedProducts?.BOTON2,
      true
    );
  }

  goExtracash() {
    this.navigatePage.push(ExtracashPage.path, {});
  }

  ionViewWillEnter(): void {
    this.loadDesktop();
    this.sgbLogic.productos = [];
    this.showBanner = true;
    this.showExtracash = false;
    PrincipalndPage.solicitaProductosv2(
      this.productsService,
      this.globalUtils,
      this.sgbLogic,
      false,
      Offers,
      this.showBanner
    );
    if (this.FF_EXTRACASH && this.sgbLogic.tipoCuentas.numTarjetas > 0) {
      this.validateExtraCashOffer();
    }
    // ONBOARDING CICE
    if (this.FF_ONBOARDINGCE) this.validateOnboardingCICE();
  }

  async loadDesktop() {
    //debugger
    //console.log('this.desktopService.ICONOS_MENU_PRINCIPAL',this.desktopService.ICONOS_MENU_PRINCIPAL);
    if (this.desktopService.ICONOS_MENU_PRINCIPAL == undefined) {
      await this.desktopService.loadIconMenu();
    }
    //if (this.sgbLogic.productos.length == 0){
    //  PrincipalndPage.solicitaProductos(this.productsService, this.globalUtils, this.sgbLogic, true);
    //}
    this.listPage = this.desktopService.ICONOS_MENU_PRINCIPAL?.filter(
      (mn) => mn.enable
    );
  }

  onOff() {
    this.show = !this.show;
  }

  verMas() {
    let cant = _.countBy(this.listPage, 'enable');
    if (this.show == true && cant.true <= 3) {
      this.show = false;
    }
    return cant.true > 3 ? true : false;
  }

  async ionViewDidEnter(): Promise<void> {
    this.subscription = this.plt.backButton.subscribeWithPriority(
      9999,
      () => {}
    );
    // let userCards =  this.applePayService.getListCard();

    //if(!this.sgbLogic.USERSTORAGE.applePay.otpVerified){
    //debugger;
    //console.log(this.parentTemplate.inputOtp);
    //this.applePayService.enviaCodigo(this.parentTemplate);
    //}
    //debugger
    this.appConstants.MENU_PRINCIPAL = true;
    this.appConstants.SHOW_APPLE_PAY = false;
    let userCards = await this.applePayService.getListCard();
    if (userCards.length > 0) {
      this.appConstants.SHOW_APPLE_PAY = true;
    }
    this.appConstants.listLateral = await this.desktopService.loadListLateral();
    //Aqui validamos Flujo Verde
    //Validamos FF FF_APPLE_PAY (environment) y SHOW_ALERT_APPLE_PAY contiene el valor (this.sgbLogic.USERSTORAGE.applePay.showSplash)
    //debugger
    if (
      this.applePayService.FF_APPLE_PAY &&
      this.appConstants.SHOW_ALERT_APPLE_PAY &&
      this.appConstants.SHOW_APPLE_PAY
    ) {
      this.applePayService.iniciaAplePay(this.parentTemplate);
      //this.applePayService.iniciaAplePay(this.parentTemplate)
      //this.applePayService.getListCard((data)=>{
      //this.appConstants.APPLE_PAY_CARD = data;
      //this.tarjetas = data;
      //},(error)=>{
      //  console.log('error',error);
      //});
    }

    this.sessionUtils.checkSessionTimeOut(false, (msj) => {
      this.navigatePage.push(HomePage.path, { sesionExpirada: msj });
    });
    // this.resetAnimations();
    //   this.loadMarginTop();
  }

  public static solicitaProductos(
    productsService: ProductsService,
    globalUtils: GlobalUtils,
    sgbLogic: SgbLogic,
    isloding,
    offers?,
    showBanner?
  ): void {
    sgbLogic.loadProductos = true;
    productsService.getProduts(isloding).subscribe(
      async (data) => {
        sgbLogic.loadProductos = false;

        if (data.Cod_error == '0') {
          //console.log("Productos", data.Data);
          if (data.Data == undefined) {
            //globalUtils.alertModal('No posee Productos para mostrar ', "Aceptar", () => {});
            globalUtils.confirmModalNd(
              'Estimado Cliente',
              'No posee Productos para mostrar ',
              'info',
              'Aceptar',
              '',
              async () => {}
            );
          } else {
            /*             for(var key in data["detalle"] ){
              const attr=PrincipalndPage.getAttr(key);
              var list=data["detalle"][key]
                 for(var i=0;i<list.length;i++){
                    list[i][attr]=(await globalUtils.decrypt(list[i][attr], ",")).toString();    
                 }
            }
            // //desencriptamos el precio de data
            for(var i=0;i<data.Data.length;i++){
                  var element =data.Data[i];
                  element.cuenta = (await globalUtils.decrypt(element.cuenta, ",")).toString();
                    PrincipalndPage.busca(
                        element,
                        element.producto,
                        data["detalle"]["DATA_" + element.producto],
                      );
            } */
            sgbLogic.productos = [];
            let tipo = ['cc', 'cd', 'pr', 'tc'];
            //debugger
            for (let i = 0; i < tipo.length; i++) {
              var list = data['Data']['productos_' + tipo[i]];
              if (tipo[i] == 'tc') {
                list.unshift(offers);
              }

              for (let j = 0; j < list.length; j++) {
                if (list[j] == null) {
                  break;
                }

                if (tipo[i] != 'tc') {
                  list[j]['cuenta'] = (
                    await globalUtils.decrypt(list[j]['cuenta'], ',')
                  ).toString();
                } else if (j > 0) {
                  list[j]['cuenta'] = (
                    await globalUtils.decrypt(list[j]['cuenta'], ',')
                  ).toString();
                }

                if (tipo[i] == 'cc') {
                  list[j]['numTarjeta'] = (
                    await globalUtils.decrypt(list[j]['numTarjeta'], ',')
                  ).toString();
                  list[j]['numCuenta'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'tc' && j > 0 && showBanner) {
                  list[j]['numCtaCredito'] = (
                    await globalUtils.decrypt(list[j]['numCtaCredito'], ',')
                  ).toString();
                  list[j]['numTarjeta'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'pr') {
                  list[j]['noCredito'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'cd') {
                  list[j]['numCertificado'] = list[j]['cuenta'];
                }
                sgbLogic.productos.push(list[j]);
              }
            }

            //sgbLogic.productos = data.Data;
            //console.log("sgbLogic.productos", sgbLogic.productos);
          }
        } else {
          globalUtils.alertModal(data.Msn, 'Aceptar', () => {});
        }
      },
      (error) => {
        sgbLogic.loadProductos = false;
        globalUtils.closeLoading();
      },
      () => {
        //console.log("-------------");
      }
    );
  }

  public static solicitaProductosv2(
    productsService: ProductsService,
    globalUtils: GlobalUtils,
    sgbLogic: SgbLogic,
    isloding,
    offers?,
    showBanner?
  ): void {
    sgbLogic.loadProductos = true;
    productsService.getProductsV2(isloding).then(
      async (data) => {
        sgbLogic.loadProductos = false;

        if (data['Cod_error'] == '0') {
          //console.log("Productos", data.Data);
          if (data['Data'] == undefined) {
            //globalUtils.alertModal('No posee Productos para mostrar ', "Aceptar", () => {});
            globalUtils.confirmModalNd(
              'Estimado Cliente',
              'No posee Productos para mostrar ',
              'info',
              'Aceptar',
              '',
              async () => {}
            );
          } else {
            /*             for(var key in data["detalle"] ){
              const attr=PrincipalndPage.getAttr(key);
              var list=data["detalle"][key]
                 for(var i=0;i<list.length;i++){
                    list[i][attr]=(await globalUtils.decrypt(list[i][attr], ",")).toString();    
                 }
            }
            // //desencriptamos el precio de data
            for(var i=0;i<data.Data.length;i++){
                  var element =data.Data[i];
                  element.cuenta = (await globalUtils.decrypt(element.cuenta, ",")).toString();
                    PrincipalndPage.busca(
                        element,
                        element.producto,
                        data["detalle"]["DATA_" + element.producto],
                      );
            } */
            sgbLogic.productos = [];
            let tipo = ['cc', 'cd', 'pr', 'tc'];
            //debugger
            for (let i = 0; i < tipo.length; i++) {
              var list = data['Data']['productos_' + tipo[i]];
              if (tipo[i] == 'tc') {
                list.unshift(offers);
              }

              for (let j = 0; j < list.length; j++) {
                if (list[j] == null) {
                  break;
                }

                if (tipo[i] != 'tc') {
                  list[j]['cuenta'] = (
                    await globalUtils.decrypt(list[j]['cuenta'], ',')
                  ).toString();
                } else if (j > 0) {
                  list[j]['cuenta'] = (
                    await globalUtils.decrypt(list[j]['cuenta'], ',')
                  ).toString();
                }

                if (tipo[i] == 'cc') {
                  list[j]['numTarjeta'] = (
                    await globalUtils.decrypt(list[j]['numTarjeta'], ',')
                  ).toString();
                  list[j]['numCuenta'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'tc' && j > 0 && showBanner) {
                  list[j]['numCtaCredito'] = (
                    await globalUtils.decrypt(list[j]['numCtaCredito'], ',')
                  ).toString();
                  list[j]['numTarjeta'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'pr') {
                  list[j]['noCredito'] = list[j]['cuenta'];
                }
                if (tipo[i] == 'cd') {
                  list[j]['numCertificado'] = list[j]['cuenta'];
                }
                sgbLogic.productos.push(list[j]);
                // respuesta.filter(objeto => objeto.producto === "CC");
              }
            }

            //sgbLogic.productos = data.Data;
            //console.log("sgbLogic.productos", sgbLogic.productos);
          }
        } else {
          // globalUtils.alertModal(data['Msn'], "Aceptar", () => {});
          globalUtils.alertModalNd(
            'Estimado Cliente',
            data['Msn'],
            'info',
            'Aceptar',
            () => {}
          );
        }
      },
      (error) => {
        sgbLogic.loadProductos = false;
        globalUtils.closeLoading();
      }
    );
  }

  static async desencriptar(list, key, globalUtils) {
    if (list)
      list.forEach(async (element) => {
        element[key] = element.cuenta = await globalUtils.decrypt(
          element[key],
          ','
        );
      });
  }

  public static busca(elemento, tipo, data) {
    let busqueda;
    switch (tipo) {
      case 'CC':
        busqueda = 'numCuenta';
        break;
      case 'TC':
        busqueda = 'numTarjeta';
        break;
      case 'CD':
        busqueda = 'numCertificado';
        break;
      case 'PR':
        busqueda = 'noCredito';
        break;
    }

    return _.find(data, (item) => {
      if (item[busqueda].toString() == elemento['cuenta'].toString()) {
        let titular = elemento.titular;
        Object.assign(elemento, item);
        elemento.titular = titular ? titular : undefined;
      }
    });
  }

  public static getAttr(key) {
    switch (key) {
      case 'DATA_CC':
        return 'numCuenta';
      case 'DATA_TC':
        return 'numCtaCredito';
      case 'DATA_CD':
        return 'numCertificado';
      case 'DATA_PR':
        return 'noCredito';
    }
  }

  public loadMarginTop() {
    if (this.appConstants.MENU_PRINCIPAL_HEIGHT == undefined) {
      const val =
        this.plt.height() -
        ($('app-principal ion-header').last().height() +
          $('app-principal ion-footer').last().height() +
          $('#menuPrincipal').height());
      this.appConstants.MENU_PRINCIPAL_HEIGHT = val / 2 > 60 ? 30 : val / 2;
    }
    // return this.appConstants.MENU_PRINCIPAL_HEIGHT;
  }

  public addEventAndPush(obj: DesktopObject, params) {
    setTimeout(() => {
      $('#' + obj.id).removeClass('breathing-effect');
      this.procesando = false;
      //this.nav.push(CuentasPage);
      this.pushComponent(obj.path, params);
    }, 400);
  }

  async showContactOptions() {
    const optionsModal = await this.modalController.create({
      component: OptionsPage,
    });

    await optionsModal.present();
  }

  public goTo(opcion: DesktopObject) {
    //.log("opcion",opcion);
    console.log('opcion', opcion);
    if (!this.procesando) {
      this.procesando = true;

      let opc = opcion.id;
      $('#' + opc).addClass('breathing-effect');

      if (opc == 'notificaciones') {
        this.addEventAndPush(opcion, {});
        $('#' + opc).removeClass('breathing-effect');
        this.procesando = false;
      } else if (this.sgbLogic.opcionesCargadas) {
        if (this.sgbLogic.hayPermisoPara(opc)) {
          this.sessionBankService
            .revisaBLStatus(this.appConstants.ultSecuenciaEncriptada)
            .subscribe(
              (status) => {
                //console.log("Status: ", status);
                if (status == '0') {
                  if (opc == 'cuentas') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'sucursales') {
                    this.addEventAndPush(opcion, { menuSucursales: true });
                  } else if (opc == 'tarjetas') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'prestamos') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'certificados') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'contacto') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'configuracion') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'notificaciones') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'ayuda') {
                    this.callCenter();
                    $('#' + opc).removeClass('breathing-effect');
                    this.procesando = false;
                  } else if (opc == 'frecuentes') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'pagos') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'transferencias') {
                    // if (this.sgbLogic.cuentasDebitarPagoTrans) {
                    this.addEventAndPush(opcion, {});
                  }
                } else if (status == '49') {
                  if (opc == 'cuentas') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'sucursales') {
                    this.addEventAndPush(opcion, { menuSucursales: true });
                  } else if (opc == 'tarjetas') {
                    this.addEventAndPush(opcion, {});
                  } else if (opc == 'prestamos') {
                    this.addEventAndPush(opcion, {});
                  } else {
                    this.solicitaMensaje(status, this.showMensaje.bind(this));
                  }
                } else if (status == '2') {
                  this.solicitaMensaje(status, (mensaje) => {
                    this.messageSGBB.hasError(status, mensaje);
                  });
                }
              },
              (error) => {
                $('#' + opc).removeClass('breathing-effect');
                this.muestraErrorEnServicio('GET_BL_STATUS', error);
              }
            );
        } else {
          $('#' + opc).removeClass('breathing-effect');
          this.solicitaMensaje(
            this.sgbLogic.getCodigo(opc),
            this.showMensaje.bind(this)
          );
        }
      } else {
        setTimeout(() => {
          this.procesando = false;
          // this.goTo(opc);
          $('#' + opc).removeClass('breathing-effect');
        }, 1000);
      }
    }
  }

  public callCenter() {
    this.callNumber
      .callNumber(this.appConstants.callCenterNum, false)
      .then((res) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err));
    //return "tel:" + this.appConstants.callCenterNum;
  }

  private solicitaMensaje(codigo, callback) {
    this.msgService.obtenerMensajeOnboarding(codigo).subscribe(
      (data) => {
        this.procesando = false;
        callback(data['Data']['PMENSAJE']);
      },
      (error) => {
        this.procesando = false;
        this.globalUtils.exception(
          error,
          'GET_MENSAJE',
          true,
          this.bankService
        );
      }
    );
  }

  private muestraErrorEnServicio(ws, error) {
    //console.log("Error", error);
    this.globalUtils.loading.dismiss();
    let action = () => {
      this.home();
    };
    this.globalUtils.globalErrorModal(action);
    //console.log("Enviando bitácora");
    this.sessionBankService.enviaBitacora(
      this.appConstants.ultSecuenciaEncriptada,
      ws,
      error
    );
  }

  private showMensaje(mensaje) {
    // this.globalUtils.alertModal(mensaje, "Aceptar", () => {});
    this.globalUtils.alertModalNd(
      'Estimado Cliente',
      mensaje,
      'info',
      'Aceptar',
      () => {}
    );
  }

  private home() {
    // this.nav.setRoot(HomePage);
    this.pushComponent(HomePage, {});
  }

  async pushComponent(ComponentPage, params) {
    if (ComponentPage == 'prestamos') {
      if (this.FF_PRESTAMOS) {
        return this.navigatePage.push(PrestamoPage.path, params);
      }
      console.log(params);
      this.validatePago(params.cuenta.noCredito, params);
    } else if (
      ComponentPage == CuentaPage.path &&
      params.cuenta.estadoCta != 'Activa'
    ) {
      let resp = await this.msgService
        .obtenerMensajeOnboarding('53')
        .toPromise();
      this.globalUtils.alertModalNd(
        'Estimado Cliente',
        resp['Data']['PMENSAJE'],
        'info',
        'Aceptar',
        () => {}
      );
    } else if (this.FF_CERTIFICADOS && ComponentPage == 'certificados') {
      console.log('Certificados Activo', CertificadoPage.path);
      console.log('Certificados Activo Params', params);
      this.navigatePage.push(CertificadoPage.path, params);
    } else {
      this.navigatePage.push(ComponentPage, params);
    }
  }

  public buscaTipo(tipo) {
    //console.log('this.listPage',this.listPage);
    return _.find(this.sgbLogic.productos, function (item) {
      return item['producto'] == tipo;
    });
  }

  public filtroProducto(tipo) {
    return _.filter(this.sgbLogic.productos, (item) => {
      return item['producto'] == tipo;
    });
  }

  verTodo(item) {
    item.show = !item.show;
    //console.log(this.show);
  }

  //prestamos

  public onPagarPrestamo(idxPmo?, params?) {
    console.log(params);
    if (this.sgbLogic.tipoCuentas.numCuentasActive > 0) {
      if (this.FF_PAGOS) {
        this.navigatePage.push(PagoConfigPage.path, {
          pagoData: {
            tipoProducto: params.cuenta.titulo,
            etiqueta: params.cuenta.principal[1].etiqueta,
            nombre: params.cuenta.subTitulo,
            cuota: params.cuenta.principal[1].valor,
            montoDesembolsado: params.cuenta.montoDesembolsado,
            tasa: params.cuenta.principal[2].valor,
            plazo: params.cuenta.principal[3].valor,
            fProxPago: params.cuenta.proxPago,
            cuenta: params.cuenta.cuenta,
          },
          operation: 'PR',
        });
      } else {
        this.navigatePage.push(PagosPage.path, {
          prestamo: idxPmo,
        });
      }
    } else {
      // this.globalUtils.alertModal(
      //   this.appConstants.LOCAL_ERR004,
      //   'Aceptar',
      //   () => {}
      // );
      this.globalUtils.alertModalNd(
        'Estimado Cliente',
        this.appConstants.LOCAL_ERR004,
        'error',
        'Aceptar',
        () => {}
      );
    }
  }

  public validatePago(idxPmo?, params?) {
    this.globalUtils.initLoading();
    this.sessionBankService
      .revisaBLStatus(this.appConstants.ultSecuenciaEncriptada)
      .subscribe(
        (status) => {
          this.globalUtils.loading.dismiss();
          //console.log("Status: ", status);
          if (status == '0') {
            this.onPagarPrestamo(idxPmo, params);
          } else if (status == '49') {
            this.solicitaMensaje(status, this.showMensaje.bind(this));
          } else {
            this.solicitaMensaje(status, (mensaje) => {
              this.messageSGB.blockResponse({
                PMENSAJE: mensaje,
                PRESP_COD: status,
              });
            });
          }
        },
        (error) => {
          this.muestraErrorEnServicio('GET_BL_STATUS', error);
        }
      );
  }

  private async validateExtraCashOffer() {
    await this.fetchOffers();
    this.extracashData = await this.secureStorage.get('ExtracashData');

    this.showModalExtracash(
      this.showExtracash &&
        (!this.isTheSameExtracashId() || !this.isTheSameLoggedUser())
    );
  }

  private isTheSameExtracashId(): any {
    if (!this.extracashData) return false;
    return (
      this.extracashData.filter(
        (item) => item.extracashId === this.PreApprovedProducts?.extracashId
      ).length > 0
    );
  }

  private isTheSameLoggedUser(): any {
    if (!this.extracashData) return false;
    return (
      this.extracashData.filter(
        (item) => item.userName === this.appConstants?.usrName
      ).length > 0
    );
  }

  private showModalExtracash(showModalExtracash: boolean) {
    if (showModalExtracash) this.modalOffers();
  
    this.showBanner = showModalExtracash;
  }
  

  private async notShowOffers() {
    let extracashUsers: Array<extracashData> =
      (await this.secureStorage.get('ExtracashData')) ?? [];
    const extracashData = {
      extracashId: this.PreApprovedProducts?.customer?.id,
      userName: this.appConstants?.usrName,
    };
    extracashUsers.push(extracashData);
    this.secureStorage.set('ExtracashData', extracashUsers);
  }

  private async validateOnboardingCICE() {
    const sessionId = this.globalUtils.generateUUID()
    await this.onboardingServiceCe
      .getHasCICE(sessionId)
      .then(async (result) => {
        this.showOnboardingCE = true;
        this.onboardingCEProduct = result['Data'][0]['Anuncio'];
        this.appConstants.ONBOARDINGCICE_BANNER_CARD =
          this.onboardingCEProduct.Imagen;
        this.appConstants.numId = result['Data'][0]['NumId'];
      })
      .catch((error) => {
        this.showOnboardingCE = false;
        console.error('Error al llamar al método getHasCICE:', error);
      });
  }

  getSgbProductCardConfig(operation: any) {
    let config: SgbProductCardConfig = {
      design: 'default',
      height: 110,
      cardType: 'pr-tarjeta',
    };
    return config;
  }
  
  public showBannerCICE(producto: any): boolean {
    let show =
      (producto.nombre == 'Cuentas' &&
      this.FF_ONBOARDINGCE &&
      this.showOnboardingCE &&
      !this.sgbLogic.loadProductos);

    if (show) {
      setTimeout(() => (this.vissible = true), 3000);
      return show;
    } else {
      return false;
    }
  }
}
