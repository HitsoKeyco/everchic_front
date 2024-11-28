const calculateShippingCost = () => {

    const volumetricWeightBase = parseFloat(20000 / 6000);
    const volumetricWeightBaseTolerance = parseFloat(8000 / 6000);

    if (cart.length > 0) {

        if (selectedOptionShipping == 'servientrega a domicilio' || selectedOptionShipping == 'servientrega Oficina') {

            if (weightTotal > 2) {
                const weightOffset = weightTotal - 2;
                isSetWeightOffset(parseFloat((weightOffset.toFixed(2))));
            } else if (weightTotal <= 2) {
                isSetWeightOffset(0)
            }

            // Factor volumétrico total (decimal)
            if (quantityProducts <= 12 && quantityProducts > 0) {
                setIsVolumetricProduct(quantityProducts * 0.06076076388888)
            } else if (quantityProducts > 12) {
                setIsVolumetricProduct(quantityProducts * 0.06076076388888)

            }

            if (isVolumetricProduct > volumetricWeightBase) {
                //restamos la volumetria base y el factor volumetrico de productos para saber q factor volumetrico esta excediendo  
                const factorVolumetricOffset = parseFloat(Math.abs(volumetricWeightBase - isVolumetricProduct));
                const factorRepeated = Math.floor(factorVolumetricOffset / volumetricWeightBaseTolerance);

            }

            if ((weightTotal <= 2 && weightTotal > 0)) {
                setIsPriceShipping(parseFloat((isPriceShipping).toFixed(2)))
                dispatch(addPriceShippingStore(parseFloat((isPriceShipping).toFixed(2))))
            } else if (weightTotal > 2) {
                setIsPriceShipping(((isWeightOffset * 0.874)) + isPriceShipping)
                dispatch(addPriceShippingStore((isWeightOffset * 0.874) + isPriceShipping))
            }
        } else if (selectedOptionShipping == 'cooperativa') {
            dispatch(addPriceShippingStore(5.50))
            setIsPriceShipping(5.50)
        } else if (selectedOptionShipping == 'servientrega galapagos') {
            dispatch(addPriceShippingStore(12.32))
            const basePrice = 12.32;
            const weightLimit = 2;
            const factorWeightPrice = 0.00345;
            let additionalCost = 0;

            if (weightTotal > weightLimit) {
                const excessWeight = weightTotal - weightLimit;
                const increments = ((parseFloat(excessWeight.toFixed(2))) * 1000) * factorWeightPrice
                additionalCost = increments;
            }

            setIsPriceShipping(basePrice + additionalCost);

        } else if (selectedOptionShipping == 'delivery') {
            dispatch(addPriceShippingStore(2.50))
            setIsPriceShipping(2.50)
        } else if (selectedOptionShipping == 'servientrega galapagos isabela') {
            dispatch(addPriceShippingStore(19.50))
            const basePrice = 19.50;
            const weightLimit = 2;
            const factorWeightPrice = 0.00547;
            let additionalCost = 0;

            if (weightTotal > weightLimit) {
                const excessWeight = weightTotal - weightLimit;
                const increments = ((parseFloat(excessWeight.toFixed(2))) * 1000) * factorWeightPrice
                additionalCost = increments;
            }

            setIsPriceShipping(basePrice + additionalCost);

        } else {
            setIsPriceShipping(0)

        }

    }
}


    // Calcula el total a pagar
    const totalToPay = new Decimal(quantityProductCart)
        .times(priceUnit)
        .plus(isDataFetchShipping.shipping_value || 0)
        .toDecimalPlaces(2)

    const total = totalToPay.toNumber();