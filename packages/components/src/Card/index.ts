import { CardActions } from './CardActions'
import { CardContent } from './CardContent'
import { CardDescription } from './CardDescription'
import { CardFooter } from './CardFooter'
import { CardHeader } from './CardHeader'
import { CardMedia } from './CardMedia'
import { CardRootComponent } from './Card'
import { CardTitle } from './CardTitle'
import type { CardComponent } from './Card.types'

export const Card = Object.assign(CardRootComponent, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Actions: CardActions,
  Media: CardMedia,
}) as CardComponent & {
  Header: typeof CardHeader
  Title: typeof CardTitle
  Description: typeof CardDescription
  Content: typeof CardContent
  Footer: typeof CardFooter
  Actions: typeof CardActions
  Media: typeof CardMedia
}

export type {
  CardProps,
  CardVariant,
  CardSize,
  CardRadius,
  CardOwnProps,
  CardClasses,
} from './Card.types'
export type { CardHeaderProps } from './CardHeader'
export type { CardTitleProps } from './CardTitle'
export type { CardFooterProps } from './CardFooter'
export type { CardActionsProps } from './CardActions'
export type { CardMediaProps } from './CardMedia'

export default Card
