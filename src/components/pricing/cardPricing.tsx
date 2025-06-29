import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PricingCardType } from "@/types/pricing/types";

function CardPricing({ title, description, price, benefits, buttonText, handleClick }: PricingCardType) {
  return (
    <Card className=" h-112 max-h-112 w-sm max-w-sm bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-lg text-white shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <Button onClick={handleClick} className="bg-green-400 hover:bg-green-600 cursor-pointer">
          {buttonText}
        </Button>
        <div>
          <p>From</p>
          <p>${price}/month</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex flex-col space-y-4">
          {title == "Basic" ? (<p> Get started with:</p>) : (<p> Everything in the {title}, plus:</p>)}
          <div>
            {benefits.map((benefit) => (
              <p>{benefit}</p>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CardPricing;
