class Carrinho {

    clickIncremento(btn) {
        let data = this.getData(btn);
        data.Quantidade++;
        this.postQuantidade(data);
    }

    clickDecremento(btn) {
        let data = this.getData(btn);
        data.Quantidade--;
        this.postQuantidade(data);
    }

    updateQuantidade(input) {
        let data = this.getData(input);
        this.postQuantidade(data);
    }

    getData(elemento) {
        var linhaDoItem = $(elemento).parents('[item-id]');
        var itemId = $(linhaDoItem).attr('item-id');
        var novaQtde = $(linhaDoItem).find('input').val();
        return {
            Id: itemId,
            Quantidade: novaQtde
        };
    }

    postQuantidade(data) {
        //Aplicando elemento de segurança com requisição Ajax
        let token = $('[name=__RequestVerificationToken]').val();

        let headers = {};
        headers['RequestVerificationToken'] = token;
        //-----**-----
 
        $.ajax({
            url: '/pedido/updatequantidade',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers: headers
        }).done(function (response) {
            //debugger;

            let itemPedido = response.itemPedido;
            let linhaDoItem = $('[item-id=' + itemPedido.id + ']');

            linhaDoItem.find('input').val(itemPedido.quantidade);
            //linhaDoItem.find('subTotal').html((itemPedido.subTotal).duasCasas());
            //linhaDoItem.find("[subtotal]").html((itemPedido.subtotal).duasCasas());

            let carrinhoViewModel = response.carrinhoViewModel;

            $('[numero-itens]').html('Total: ' + carrinhoViewModel.itens.length + ' itens');
            $('[total]').html((carrinhoViewModel.total).duasCasas());

            if (itemPedido.quantidade == 0) {
                linhaDoItem.remove();
            }
        });
    }
}

var carrinho = new Carrinho();

//Função para obter 2 casas decimais e vírgula no lugar do ponto
Number.prototype.duasCasas = function () {
    return this.toFixed(2).replace('.' , ',');
}