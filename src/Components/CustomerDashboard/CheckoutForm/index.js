import { Dialog } from "@mui/material";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const CheckoutForm = (props) => {
  const stripePromise = loadStripe(
    "pk_test_51JhVWqLH6n6raFZuNhnyQHbs18FMZ386vCNya274gJTZjGcay51TPxSic4yYVx8U0hvjQKW0W5GKkN6z6PlSOjOx00wo162imO"
  );

  return (
    <div>
      <Dialog open={true} onClose={props.handleClosePaymentPopup}>
        <div id="checkout">
          {props.stripePayment !== null && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: props.stripePayment }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CheckoutForm;
