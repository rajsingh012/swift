/**
 * Ambient declarations for `@swift/icons/*` subpath imports.
 *
 * The icon package is CODE-GENERATED at build time (packages/icons/scripts/
 * generate.mjs) and its `dist` is gitignored, so there is no persistent
 * source or committed declaration for `tsc` to resolve. On a fresh CI
 * checkout (e.g. Vercel) the built `dist/*.d.ts` may be missing or stale when
 * the example type-checks, which broke `tsc -b` with TS2307/TS7016 across
 * every icon import.
 *
 * This file declares each icon subpath (named + default export) with the
 * shared icon component type, matching how Vite bundles them from source, so
 * the type-check never depends on the built icon package.
 *
 * GENERATED — do not edit by hand. Regenerate with:
 *   node apps/example/scripts/gen-icon-types.mjs
 */
import type {
  ComponentPropsWithoutRef,
  NamedExoticComponent,
  RefAttributes,
} from 'react'

interface SwiftIconProps extends ComponentPropsWithoutRef<'svg'> {
  size?: number | string
  title?: string
}
type SwiftIconComponent = NamedExoticComponent<
  SwiftIconProps & RefAttributes<SVGSVGElement>
>

declare module '@swift/icons' {
  export const SvgIcon: SwiftIconComponent
  export const ACUnit: SwiftIconComponent
  export const Access: SwiftIconComponent
  export const Accessible: SwiftIconComponent
  export const ActivitiesForKids: SwiftIconComponent
  export const Add: SwiftIconComponent
  export const Afternoon: SwiftIconComponent
  export const AirPurifier: SwiftIconComponent
  export const AirlineSeatReclineExtra: SwiftIconComponent
  export const AirlineSeatReclineExtraFilled: SwiftIconComponent
  export const AirlineSeatReclineNormal: SwiftIconComponent
  export const AirlineSeatReclineNormalFilled: SwiftIconComponent
  export const AirlinesFilled: SwiftIconComponent
  export const Alert: SwiftIconComponent
  export const ArrowDecrease: SwiftIconComponent
  export const ArrowDown: SwiftIconComponent
  export const ArrowDownLong: SwiftIconComponent
  export const ArrowIncrease: SwiftIconComponent
  export const ArrowLeft: SwiftIconComponent
  export const ArrowLeftCircle: SwiftIconComponent
  export const ArrowLeftLong: SwiftIconComponent
  export const ArrowRight: SwiftIconComponent
  export const ArrowRightCircle: SwiftIconComponent
  export const ArrowRightLong: SwiftIconComponent
  export const ArrowUp: SwiftIconComponent
  export const ArrowUpLong: SwiftIconComponent
  export const Attachment: SwiftIconComponent
  export const Bag: SwiftIconComponent
  export const BagCheckin: SwiftIconComponent
  export const BagCheckinFilled: SwiftIconComponent
  export const BagFilled: SwiftIconComponent
  export const BaggageBeltFilled: SwiftIconComponent
  export const Balcony: SwiftIconComponent
  export const BankFilled: SwiftIconComponent
  export const Bar: SwiftIconComponent
  export const Bathtub: SwiftIconComponent
  export const BatteryEmpty: SwiftIconComponent
  export const BatteryFull: SwiftIconComponent
  export const Beach: SwiftIconComponent
  export const BedKing: SwiftIconComponent
  export const BellReception: SwiftIconComponent
  export const BoardDirectionFilled: SwiftIconComponent
  export const BoardingPassFilled: SwiftIconComponent
  export const Bookmark: SwiftIconComponent
  export const Building: SwiftIconComponent
  export const Bus: SwiftIconComponent
  export const BusFilled: SwiftIconComponent
  export const CCTV: SwiftIconComponent
  export const CabFilled: SwiftIconComponent
  export const Cafe: SwiftIconComponent
  export const Calendar: SwiftIconComponent
  export const CalendarModify: SwiftIconComponent
  export const CalenderModifyFilled: SwiftIconComponent
  export const Call: SwiftIconComponent
  export const CallFilled: SwiftIconComponent
  export const CancelTicket: SwiftIconComponent
  export const CancelTicketFilled: SwiftIconComponent
  export const Casino: SwiftIconComponent
  export const ChatFilled: SwiftIconComponent
  export const Check: SwiftIconComponent
  export const CheckCircle: SwiftIconComponent
  export const CheckCircleFilled: SwiftIconComponent
  export const CheckShieldFilled: SwiftIconComponent
  export const Checkin: SwiftIconComponent
  export const CheckinFilled: SwiftIconComponent
  export const ChevronLeft: SwiftIconComponent
  export const ChevronLeftCircle: SwiftIconComponent
  export const ChevronLeftCircleFilled: SwiftIconComponent
  export const ChevronRight: SwiftIconComponent
  export const ChevronRightCircle: SwiftIconComponent
  export const ChevronRightCircleFilled: SwiftIconComponent
  export const Child: SwiftIconComponent
  export const City: SwiftIconComponent
  export const Close: SwiftIconComponent
  export const CloseCircle: SwiftIconComponent
  export const CloseCircleFilled: SwiftIconComponent
  export const CommonArea: SwiftIconComponent
  export const ConfirmedTicketFilled: SwiftIconComponent
  export const ContentCopy: SwiftIconComponent
  export const CoupleFriendly: SwiftIconComponent
  export const CreditCard: SwiftIconComponent
  export const CustomerServiceFilled: SwiftIconComponent
  export const Delete: SwiftIconComponent
  export const DeleteFilled: SwiftIconComponent
  export const Discount: SwiftIconComponent
  export const DiscountFilled: SwiftIconComponent
  export const DistanceFilled: SwiftIconComponent
  export const Document: SwiftIconComponent
  export const DocumentShield: SwiftIconComponent
  export const Download: SwiftIconComponent
  export const EMI: SwiftIconComponent
  export const EV: SwiftIconComponent
  export const EasyEMI: SwiftIconComponent
  export const Edit: SwiftIconComponent
  export const EditDocument: SwiftIconComponent
  export const EditFilled: SwiftIconComponent
  export const Elevator: SwiftIconComponent
  export const Evening: SwiftIconComponent
  export const ExclamationCircle: SwiftIconComponent
  export const ExclamationCircleFilled: SwiftIconComponent
  export const ExpandDownCircle: SwiftIconComponent
  export const ExpandDownCircleFilled: SwiftIconComponent
  export const ExpandLess: SwiftIconComponent
  export const ExpandMore: SwiftIconComponent
  export const ExpandUpCircle: SwiftIconComponent
  export const ExpandUpCircleFilled: SwiftIconComponent
  export const Eye: SwiftIconComponent
  export const EyeFilled: SwiftIconComponent
  export const FacebookFilled: SwiftIconComponent
  export const FamilyKids: SwiftIconComponent
  export const Filter: SwiftIconComponent
  export const FilterFunnel: SwiftIconComponent
  export const FilterFunnelFilled: SwiftIconComponent
  export const Fitness: SwiftIconComponent
  export const Flag: SwiftIconComponent
  export const Flash: SwiftIconComponent
  export const FlashCircleFilled: SwiftIconComponent
  export const FlashFilled: SwiftIconComponent
  export const Flight: SwiftIconComponent
  export const FlightEngineFilled: SwiftIconComponent
  export const FlightFilled: SwiftIconComponent
  export const FlightLanding: SwiftIconComponent
  export const FlightLandingFilled: SwiftIconComponent
  export const FlightTakeoff: SwiftIconComponent
  export const FlightTakeoffFilled: SwiftIconComponent
  export const FlightTicketFilled: SwiftIconComponent
  export const FlightTilted: SwiftIconComponent
  export const FlightTiltedLeftFilled: SwiftIconComponent
  export const FlightTiltedRightFilled: SwiftIconComponent
  export const Flower: SwiftIconComponent
  export const Food: SwiftIconComponent
  export const FoodAndDrinks: SwiftIconComponent
  export const FoodFilled: SwiftIconComponent
  export const Garden: SwiftIconComponent
  export const GolfCourse: SwiftIconComponent
  export const GridSmall: SwiftIconComponent
  export const GridSmallFilled: SwiftIconComponent
  export const GroupFilled: SwiftIconComponent
  export const Heart: SwiftIconComponent
  export const HeartFilled: SwiftIconComponent
  export const HideEye: SwiftIconComponent
  export const HideEyeFilled: SwiftIconComponent
  export const History: SwiftIconComponent
  export const HolidaysFilled: SwiftIconComponent
  export const Home: SwiftIconComponent
  export const HotSpringAccess: SwiftIconComponent
  export const Hotel: SwiftIconComponent
  export const HotelFilled: SwiftIconComponent
  export const Housekeeping: SwiftIconComponent
  export const ID: SwiftIconComponent
  export const IdFilled: SwiftIconComponent
  export const Image: SwiftIconComponent
  export const InfoCircle: SwiftIconComponent
  export const InfoCircleFilled: SwiftIconComponent
  export const InstagramFilled: SwiftIconComponent
  export const InternetBanking: SwiftIconComponent
  export const Keyboard: SwiftIconComponent
  export const KeyboardFilled: SwiftIconComponent
  export const Kitchen: SwiftIconComponent
  export const Lakeview: SwiftIconComponent
  export const Language: SwiftIconComponent
  export const Laundry: SwiftIconComponent
  export const LinkedinFilled: SwiftIconComponent
  export const Location: SwiftIconComponent
  export const LocationOn: SwiftIconComponent
  export const LocationOnFilled: SwiftIconComponent
  export const LogoutFilled: SwiftIconComponent
  export const Lounge: SwiftIconComponent
  export const LuggageFilled: SwiftIconComponent
  export const LuggageStorage: SwiftIconComponent
  export const Mail: SwiftIconComponent
  export const MailFilled: SwiftIconComponent
  export const Meeting: SwiftIconComponent
  export const MessageBlockFilled: SwiftIconComponent
  export const Mic: SwiftIconComponent
  export const MicFilled: SwiftIconComponent
  export const Microwave: SwiftIconComponent
  export const MoreCircle: SwiftIconComponent
  export const MoreFilled: SwiftIconComponent
  export const MoreHoriz: SwiftIconComponent
  export const MoreVert: SwiftIconComponent
  export const Morning: SwiftIconComponent
  export const MultipleUsers: SwiftIconComponent
  export const MultipleUsersFilled: SwiftIconComponent
  export const MyLocation: SwiftIconComponent
  export const MyLocationFilled: SwiftIconComponent
  export const MyTripsFilled: SwiftIconComponent
  export const NatureAndWildlife: SwiftIconComponent
  export const Navigation: SwiftIconComponent
  export const NearMe: SwiftIconComponent
  export const Night: SwiftIconComponent
  export const NoCabFilled: SwiftIconComponent
  export const NoFood: SwiftIconComponent
  export const NoLuggageFilled: SwiftIconComponent
  export const NoPower: SwiftIconComponent
  export const NoSeat: SwiftIconComponent
  export const NoSeatFilled: SwiftIconComponent
  export const NoShieldFilled: SwiftIconComponent
  export const NoVideo: SwiftIconComponent
  export const NonRefundable: SwiftIconComponent
  export const NonVeg: SwiftIconComponent
  export const Notifications: SwiftIconComponent
  export const OtherAmenities: SwiftIconComponent
  export const OutdoorActivity: SwiftIconComponent
  export const PantryFilled: SwiftIconComponent
  export const Parking: SwiftIconComponent
  export const PartialRefund: SwiftIconComponent
  export const Passport: SwiftIconComponent
  export const PassportFilled: SwiftIconComponent
  export const PasswordSMS: SwiftIconComponent
  export const PasswordSMSFilled: SwiftIconComponent
  export const PauseFilled: SwiftIconComponent
  export const PayLater: SwiftIconComponent
  export const PayWithPoints: SwiftIconComponent
  export const Person: SwiftIconComponent
  export const PersonAdd: SwiftIconComponent
  export const PersonFilled: SwiftIconComponent
  export const PetFriendly: SwiftIconComponent
  export const PlayArea: SwiftIconComponent
  export const PlayFilled: SwiftIconComponent
  export const Power: SwiftIconComponent
  export const PriceLockFilled: SwiftIconComponent
  export const Refresh: SwiftIconComponent
  export const Refrigerator: SwiftIconComponent
  export const Refundable: SwiftIconComponent
  export const Remove: SwiftIconComponent
  export const Replay: SwiftIconComponent
  export const Report: SwiftIconComponent
  export const RequestCallbackFilled: SwiftIconComponent
  export const Room: SwiftIconComponent
  export const RoomAmenities: SwiftIconComponent
  export const RoomArea: SwiftIconComponent
  export const RoomFilled: SwiftIconComponent
  export const RoomService: SwiftIconComponent
  export const RupeeCircle: SwiftIconComponent
  export const RupeeCircleFilled: SwiftIconComponent
  export const Safety: SwiftIconComponent
  export const SandTimeFilled: SwiftIconComponent
  export const ScanQR: SwiftIconComponent
  export const Schedule: SwiftIconComponent
  export const ScheduleFilled: SwiftIconComponent
  export const ScheduleFlexibleFilled: SwiftIconComponent
  export const Search: SwiftIconComponent
  export const SeatsLeftFilled: SwiftIconComponent
  export const Security: SwiftIconComponent
  export const SendMessageFilled: SwiftIconComponent
  export const Services: SwiftIconComponent
  export const Settings: SwiftIconComponent
  export const Share: SwiftIconComponent
  export const ShareIos: SwiftIconComponent
  export const Signal: SwiftIconComponent
  export const Smoking: SwiftIconComponent
  export const SortFilled: SwiftIconComponent
  export const Spa: SwiftIconComponent
  export const Spoon: SwiftIconComponent
  export const Sports: SwiftIconComponent
  export const SportsBasketball: SwiftIconComponent
  export const Star: SwiftIconComponent
  export const StarFilled: SwiftIconComponent
  export const StarShieldFilled: SwiftIconComponent
  export const Station: SwiftIconComponent
  export const Swap: SwiftIconComponent
  export const SwiftCreditFilled: SwiftIconComponent
  export const SwiftMoney: SwiftIconComponent
  export const SwiftMoneyCircleFilled: SwiftIconComponent
  export const SwiftMoneyFilled: SwiftIconComponent
  export const SwiftMoneyMax: SwiftIconComponent
  export const SwiftMoneyMaxFilled: SwiftIconComponent
  export const SwiftMoneyMaxFilled1: SwiftIconComponent
  export const Swimming: SwiftIconComponent
  export const SwimmingPool: SwiftIconComponent
  export const Sync: SwiftIconComponent
  export const Tag: SwiftIconComponent
  export const ThumbDown: SwiftIconComponent
  export const ThumbUp: SwiftIconComponent
  export const ThumbsDownFilled: SwiftIconComponent
  export const ThumbsUpFilled: SwiftIconComponent
  export const TicketFilled: SwiftIconComponent
  export const TicketHorizontal: SwiftIconComponent
  export const TicketHorizontalFilled: SwiftIconComponent
  export const TotalDistance: SwiftIconComponent
  export const Train: SwiftIconComponent
  export const TrainCT: SwiftIconComponent
  export const TrainCTFilled: SwiftIconComponent
  export const TrainFilled: SwiftIconComponent
  export const Transport: SwiftIconComponent
  export const TrendDown: SwiftIconComponent
  export const TrendUp: SwiftIconComponent
  export const TrendUpCircle: SwiftIconComponent
  export const Tune: SwiftIconComponent
  export const TwitterFilled: SwiftIconComponent
  export const Upload: SwiftIconComponent
  export const Valet: SwiftIconComponent
  export const Veg: SwiftIconComponent
  export const Video: SwiftIconComponent
  export const VideoFilled: SwiftIconComponent
  export const VideoGaming: SwiftIconComponent
  export const View: SwiftIconComponent
  export const VolumeOff: SwiftIconComponent
  export const VolumeUp: SwiftIconComponent
  export const Wallet: SwiftIconComponent
  export const WalletFilled: SwiftIconComponent
  export const WaterSports: SwiftIconComponent
  export const Wellness: SwiftIconComponent
  export const Wifi: SwiftIconComponent
  export const WifiOff: SwiftIconComponent
  export const YoutubeFilled: SwiftIconComponent
  export const ZoomIn: SwiftIconComponent
  export const ZoomOut: SwiftIconComponent
}

declare module '@swift/icons/ACUnit' {
  export const ACUnit: SwiftIconComponent
  export default ACUnit
}
declare module '@swift/icons/Access' {
  export const Access: SwiftIconComponent
  export default Access
}
declare module '@swift/icons/Accessible' {
  export const Accessible: SwiftIconComponent
  export default Accessible
}
declare module '@swift/icons/ActivitiesForKids' {
  export const ActivitiesForKids: SwiftIconComponent
  export default ActivitiesForKids
}
declare module '@swift/icons/Add' {
  export const Add: SwiftIconComponent
  export default Add
}
declare module '@swift/icons/Afternoon' {
  export const Afternoon: SwiftIconComponent
  export default Afternoon
}
declare module '@swift/icons/AirPurifier' {
  export const AirPurifier: SwiftIconComponent
  export default AirPurifier
}
declare module '@swift/icons/AirlineSeatReclineExtra' {
  export const AirlineSeatReclineExtra: SwiftIconComponent
  export default AirlineSeatReclineExtra
}
declare module '@swift/icons/AirlineSeatReclineExtraFilled' {
  export const AirlineSeatReclineExtraFilled: SwiftIconComponent
  export default AirlineSeatReclineExtraFilled
}
declare module '@swift/icons/AirlineSeatReclineNormal' {
  export const AirlineSeatReclineNormal: SwiftIconComponent
  export default AirlineSeatReclineNormal
}
declare module '@swift/icons/AirlineSeatReclineNormalFilled' {
  export const AirlineSeatReclineNormalFilled: SwiftIconComponent
  export default AirlineSeatReclineNormalFilled
}
declare module '@swift/icons/AirlinesFilled' {
  export const AirlinesFilled: SwiftIconComponent
  export default AirlinesFilled
}
declare module '@swift/icons/Alert' {
  export const Alert: SwiftIconComponent
  export default Alert
}
declare module '@swift/icons/ArrowDecrease' {
  export const ArrowDecrease: SwiftIconComponent
  export default ArrowDecrease
}
declare module '@swift/icons/ArrowDown' {
  export const ArrowDown: SwiftIconComponent
  export default ArrowDown
}
declare module '@swift/icons/ArrowDownLong' {
  export const ArrowDownLong: SwiftIconComponent
  export default ArrowDownLong
}
declare module '@swift/icons/ArrowIncrease' {
  export const ArrowIncrease: SwiftIconComponent
  export default ArrowIncrease
}
declare module '@swift/icons/ArrowLeft' {
  export const ArrowLeft: SwiftIconComponent
  export default ArrowLeft
}
declare module '@swift/icons/ArrowLeftCircle' {
  export const ArrowLeftCircle: SwiftIconComponent
  export default ArrowLeftCircle
}
declare module '@swift/icons/ArrowLeftLong' {
  export const ArrowLeftLong: SwiftIconComponent
  export default ArrowLeftLong
}
declare module '@swift/icons/ArrowRight' {
  export const ArrowRight: SwiftIconComponent
  export default ArrowRight
}
declare module '@swift/icons/ArrowRightCircle' {
  export const ArrowRightCircle: SwiftIconComponent
  export default ArrowRightCircle
}
declare module '@swift/icons/ArrowRightLong' {
  export const ArrowRightLong: SwiftIconComponent
  export default ArrowRightLong
}
declare module '@swift/icons/ArrowUp' {
  export const ArrowUp: SwiftIconComponent
  export default ArrowUp
}
declare module '@swift/icons/ArrowUpLong' {
  export const ArrowUpLong: SwiftIconComponent
  export default ArrowUpLong
}
declare module '@swift/icons/Attachment' {
  export const Attachment: SwiftIconComponent
  export default Attachment
}
declare module '@swift/icons/Bag' {
  export const Bag: SwiftIconComponent
  export default Bag
}
declare module '@swift/icons/BagCheckin' {
  export const BagCheckin: SwiftIconComponent
  export default BagCheckin
}
declare module '@swift/icons/BagCheckinFilled' {
  export const BagCheckinFilled: SwiftIconComponent
  export default BagCheckinFilled
}
declare module '@swift/icons/BagFilled' {
  export const BagFilled: SwiftIconComponent
  export default BagFilled
}
declare module '@swift/icons/BaggageBeltFilled' {
  export const BaggageBeltFilled: SwiftIconComponent
  export default BaggageBeltFilled
}
declare module '@swift/icons/Balcony' {
  export const Balcony: SwiftIconComponent
  export default Balcony
}
declare module '@swift/icons/BankFilled' {
  export const BankFilled: SwiftIconComponent
  export default BankFilled
}
declare module '@swift/icons/Bar' {
  export const Bar: SwiftIconComponent
  export default Bar
}
declare module '@swift/icons/Bathtub' {
  export const Bathtub: SwiftIconComponent
  export default Bathtub
}
declare module '@swift/icons/BatteryEmpty' {
  export const BatteryEmpty: SwiftIconComponent
  export default BatteryEmpty
}
declare module '@swift/icons/BatteryFull' {
  export const BatteryFull: SwiftIconComponent
  export default BatteryFull
}
declare module '@swift/icons/Beach' {
  export const Beach: SwiftIconComponent
  export default Beach
}
declare module '@swift/icons/BedKing' {
  export const BedKing: SwiftIconComponent
  export default BedKing
}
declare module '@swift/icons/BellReception' {
  export const BellReception: SwiftIconComponent
  export default BellReception
}
declare module '@swift/icons/BoardDirectionFilled' {
  export const BoardDirectionFilled: SwiftIconComponent
  export default BoardDirectionFilled
}
declare module '@swift/icons/BoardingPassFilled' {
  export const BoardingPassFilled: SwiftIconComponent
  export default BoardingPassFilled
}
declare module '@swift/icons/Bookmark' {
  export const Bookmark: SwiftIconComponent
  export default Bookmark
}
declare module '@swift/icons/Building' {
  export const Building: SwiftIconComponent
  export default Building
}
declare module '@swift/icons/Bus' {
  export const Bus: SwiftIconComponent
  export default Bus
}
declare module '@swift/icons/BusFilled' {
  export const BusFilled: SwiftIconComponent
  export default BusFilled
}
declare module '@swift/icons/CCTV' {
  export const CCTV: SwiftIconComponent
  export default CCTV
}
declare module '@swift/icons/CabFilled' {
  export const CabFilled: SwiftIconComponent
  export default CabFilled
}
declare module '@swift/icons/Cafe' {
  export const Cafe: SwiftIconComponent
  export default Cafe
}
declare module '@swift/icons/Calendar' {
  export const Calendar: SwiftIconComponent
  export default Calendar
}
declare module '@swift/icons/CalendarModify' {
  export const CalendarModify: SwiftIconComponent
  export default CalendarModify
}
declare module '@swift/icons/CalenderModifyFilled' {
  export const CalenderModifyFilled: SwiftIconComponent
  export default CalenderModifyFilled
}
declare module '@swift/icons/Call' {
  export const Call: SwiftIconComponent
  export default Call
}
declare module '@swift/icons/CallFilled' {
  export const CallFilled: SwiftIconComponent
  export default CallFilled
}
declare module '@swift/icons/CancelTicket' {
  export const CancelTicket: SwiftIconComponent
  export default CancelTicket
}
declare module '@swift/icons/CancelTicketFilled' {
  export const CancelTicketFilled: SwiftIconComponent
  export default CancelTicketFilled
}
declare module '@swift/icons/Casino' {
  export const Casino: SwiftIconComponent
  export default Casino
}
declare module '@swift/icons/ChatFilled' {
  export const ChatFilled: SwiftIconComponent
  export default ChatFilled
}
declare module '@swift/icons/Check' {
  export const Check: SwiftIconComponent
  export default Check
}
declare module '@swift/icons/CheckCircle' {
  export const CheckCircle: SwiftIconComponent
  export default CheckCircle
}
declare module '@swift/icons/CheckCircleFilled' {
  export const CheckCircleFilled: SwiftIconComponent
  export default CheckCircleFilled
}
declare module '@swift/icons/CheckShieldFilled' {
  export const CheckShieldFilled: SwiftIconComponent
  export default CheckShieldFilled
}
declare module '@swift/icons/Checkin' {
  export const Checkin: SwiftIconComponent
  export default Checkin
}
declare module '@swift/icons/CheckinFilled' {
  export const CheckinFilled: SwiftIconComponent
  export default CheckinFilled
}
declare module '@swift/icons/ChevronLeft' {
  export const ChevronLeft: SwiftIconComponent
  export default ChevronLeft
}
declare module '@swift/icons/ChevronLeftCircle' {
  export const ChevronLeftCircle: SwiftIconComponent
  export default ChevronLeftCircle
}
declare module '@swift/icons/ChevronLeftCircleFilled' {
  export const ChevronLeftCircleFilled: SwiftIconComponent
  export default ChevronLeftCircleFilled
}
declare module '@swift/icons/ChevronRight' {
  export const ChevronRight: SwiftIconComponent
  export default ChevronRight
}
declare module '@swift/icons/ChevronRightCircle' {
  export const ChevronRightCircle: SwiftIconComponent
  export default ChevronRightCircle
}
declare module '@swift/icons/ChevronRightCircleFilled' {
  export const ChevronRightCircleFilled: SwiftIconComponent
  export default ChevronRightCircleFilled
}
declare module '@swift/icons/Child' {
  export const Child: SwiftIconComponent
  export default Child
}
declare module '@swift/icons/City' {
  export const City: SwiftIconComponent
  export default City
}
declare module '@swift/icons/Close' {
  export const Close: SwiftIconComponent
  export default Close
}
declare module '@swift/icons/CloseCircle' {
  export const CloseCircle: SwiftIconComponent
  export default CloseCircle
}
declare module '@swift/icons/CloseCircleFilled' {
  export const CloseCircleFilled: SwiftIconComponent
  export default CloseCircleFilled
}
declare module '@swift/icons/CommonArea' {
  export const CommonArea: SwiftIconComponent
  export default CommonArea
}
declare module '@swift/icons/ConfirmedTicketFilled' {
  export const ConfirmedTicketFilled: SwiftIconComponent
  export default ConfirmedTicketFilled
}
declare module '@swift/icons/ContentCopy' {
  export const ContentCopy: SwiftIconComponent
  export default ContentCopy
}
declare module '@swift/icons/CoupleFriendly' {
  export const CoupleFriendly: SwiftIconComponent
  export default CoupleFriendly
}
declare module '@swift/icons/CreditCard' {
  export const CreditCard: SwiftIconComponent
  export default CreditCard
}
declare module '@swift/icons/CustomerServiceFilled' {
  export const CustomerServiceFilled: SwiftIconComponent
  export default CustomerServiceFilled
}
declare module '@swift/icons/Delete' {
  export const Delete: SwiftIconComponent
  export default Delete
}
declare module '@swift/icons/DeleteFilled' {
  export const DeleteFilled: SwiftIconComponent
  export default DeleteFilled
}
declare module '@swift/icons/Discount' {
  export const Discount: SwiftIconComponent
  export default Discount
}
declare module '@swift/icons/DiscountFilled' {
  export const DiscountFilled: SwiftIconComponent
  export default DiscountFilled
}
declare module '@swift/icons/DistanceFilled' {
  export const DistanceFilled: SwiftIconComponent
  export default DistanceFilled
}
declare module '@swift/icons/Document' {
  export const Document: SwiftIconComponent
  export default Document
}
declare module '@swift/icons/DocumentShield' {
  export const DocumentShield: SwiftIconComponent
  export default DocumentShield
}
declare module '@swift/icons/Download' {
  export const Download: SwiftIconComponent
  export default Download
}
declare module '@swift/icons/EMI' {
  export const EMI: SwiftIconComponent
  export default EMI
}
declare module '@swift/icons/EV' {
  export const EV: SwiftIconComponent
  export default EV
}
declare module '@swift/icons/EasyEMI' {
  export const EasyEMI: SwiftIconComponent
  export default EasyEMI
}
declare module '@swift/icons/Edit' {
  export const Edit: SwiftIconComponent
  export default Edit
}
declare module '@swift/icons/EditDocument' {
  export const EditDocument: SwiftIconComponent
  export default EditDocument
}
declare module '@swift/icons/EditFilled' {
  export const EditFilled: SwiftIconComponent
  export default EditFilled
}
declare module '@swift/icons/Elevator' {
  export const Elevator: SwiftIconComponent
  export default Elevator
}
declare module '@swift/icons/Evening' {
  export const Evening: SwiftIconComponent
  export default Evening
}
declare module '@swift/icons/ExclamationCircle' {
  export const ExclamationCircle: SwiftIconComponent
  export default ExclamationCircle
}
declare module '@swift/icons/ExclamationCircleFilled' {
  export const ExclamationCircleFilled: SwiftIconComponent
  export default ExclamationCircleFilled
}
declare module '@swift/icons/ExpandDownCircle' {
  export const ExpandDownCircle: SwiftIconComponent
  export default ExpandDownCircle
}
declare module '@swift/icons/ExpandDownCircleFilled' {
  export const ExpandDownCircleFilled: SwiftIconComponent
  export default ExpandDownCircleFilled
}
declare module '@swift/icons/ExpandLess' {
  export const ExpandLess: SwiftIconComponent
  export default ExpandLess
}
declare module '@swift/icons/ExpandMore' {
  export const ExpandMore: SwiftIconComponent
  export default ExpandMore
}
declare module '@swift/icons/ExpandUpCircle' {
  export const ExpandUpCircle: SwiftIconComponent
  export default ExpandUpCircle
}
declare module '@swift/icons/ExpandUpCircleFilled' {
  export const ExpandUpCircleFilled: SwiftIconComponent
  export default ExpandUpCircleFilled
}
declare module '@swift/icons/Eye' {
  export const Eye: SwiftIconComponent
  export default Eye
}
declare module '@swift/icons/EyeFilled' {
  export const EyeFilled: SwiftIconComponent
  export default EyeFilled
}
declare module '@swift/icons/FacebookFilled' {
  export const FacebookFilled: SwiftIconComponent
  export default FacebookFilled
}
declare module '@swift/icons/FamilyKids' {
  export const FamilyKids: SwiftIconComponent
  export default FamilyKids
}
declare module '@swift/icons/Filter' {
  export const Filter: SwiftIconComponent
  export default Filter
}
declare module '@swift/icons/FilterFunnel' {
  export const FilterFunnel: SwiftIconComponent
  export default FilterFunnel
}
declare module '@swift/icons/FilterFunnelFilled' {
  export const FilterFunnelFilled: SwiftIconComponent
  export default FilterFunnelFilled
}
declare module '@swift/icons/Fitness' {
  export const Fitness: SwiftIconComponent
  export default Fitness
}
declare module '@swift/icons/Flag' {
  export const Flag: SwiftIconComponent
  export default Flag
}
declare module '@swift/icons/Flash' {
  export const Flash: SwiftIconComponent
  export default Flash
}
declare module '@swift/icons/FlashCircleFilled' {
  export const FlashCircleFilled: SwiftIconComponent
  export default FlashCircleFilled
}
declare module '@swift/icons/FlashFilled' {
  export const FlashFilled: SwiftIconComponent
  export default FlashFilled
}
declare module '@swift/icons/Flight' {
  export const Flight: SwiftIconComponent
  export default Flight
}
declare module '@swift/icons/FlightEngineFilled' {
  export const FlightEngineFilled: SwiftIconComponent
  export default FlightEngineFilled
}
declare module '@swift/icons/FlightFilled' {
  export const FlightFilled: SwiftIconComponent
  export default FlightFilled
}
declare module '@swift/icons/FlightLanding' {
  export const FlightLanding: SwiftIconComponent
  export default FlightLanding
}
declare module '@swift/icons/FlightLandingFilled' {
  export const FlightLandingFilled: SwiftIconComponent
  export default FlightLandingFilled
}
declare module '@swift/icons/FlightTakeoff' {
  export const FlightTakeoff: SwiftIconComponent
  export default FlightTakeoff
}
declare module '@swift/icons/FlightTakeoffFilled' {
  export const FlightTakeoffFilled: SwiftIconComponent
  export default FlightTakeoffFilled
}
declare module '@swift/icons/FlightTicketFilled' {
  export const FlightTicketFilled: SwiftIconComponent
  export default FlightTicketFilled
}
declare module '@swift/icons/FlightTilted' {
  export const FlightTilted: SwiftIconComponent
  export default FlightTilted
}
declare module '@swift/icons/FlightTiltedLeftFilled' {
  export const FlightTiltedLeftFilled: SwiftIconComponent
  export default FlightTiltedLeftFilled
}
declare module '@swift/icons/FlightTiltedRightFilled' {
  export const FlightTiltedRightFilled: SwiftIconComponent
  export default FlightTiltedRightFilled
}
declare module '@swift/icons/Flower' {
  export const Flower: SwiftIconComponent
  export default Flower
}
declare module '@swift/icons/Food' {
  export const Food: SwiftIconComponent
  export default Food
}
declare module '@swift/icons/FoodAndDrinks' {
  export const FoodAndDrinks: SwiftIconComponent
  export default FoodAndDrinks
}
declare module '@swift/icons/FoodFilled' {
  export const FoodFilled: SwiftIconComponent
  export default FoodFilled
}
declare module '@swift/icons/Garden' {
  export const Garden: SwiftIconComponent
  export default Garden
}
declare module '@swift/icons/GolfCourse' {
  export const GolfCourse: SwiftIconComponent
  export default GolfCourse
}
declare module '@swift/icons/GridSmall' {
  export const GridSmall: SwiftIconComponent
  export default GridSmall
}
declare module '@swift/icons/GridSmallFilled' {
  export const GridSmallFilled: SwiftIconComponent
  export default GridSmallFilled
}
declare module '@swift/icons/GroupFilled' {
  export const GroupFilled: SwiftIconComponent
  export default GroupFilled
}
declare module '@swift/icons/Heart' {
  export const Heart: SwiftIconComponent
  export default Heart
}
declare module '@swift/icons/HeartFilled' {
  export const HeartFilled: SwiftIconComponent
  export default HeartFilled
}
declare module '@swift/icons/HideEye' {
  export const HideEye: SwiftIconComponent
  export default HideEye
}
declare module '@swift/icons/HideEyeFilled' {
  export const HideEyeFilled: SwiftIconComponent
  export default HideEyeFilled
}
declare module '@swift/icons/History' {
  export const History: SwiftIconComponent
  export default History
}
declare module '@swift/icons/HolidaysFilled' {
  export const HolidaysFilled: SwiftIconComponent
  export default HolidaysFilled
}
declare module '@swift/icons/Home' {
  export const Home: SwiftIconComponent
  export default Home
}
declare module '@swift/icons/HotSpringAccess' {
  export const HotSpringAccess: SwiftIconComponent
  export default HotSpringAccess
}
declare module '@swift/icons/Hotel' {
  export const Hotel: SwiftIconComponent
  export default Hotel
}
declare module '@swift/icons/HotelFilled' {
  export const HotelFilled: SwiftIconComponent
  export default HotelFilled
}
declare module '@swift/icons/Housekeeping' {
  export const Housekeeping: SwiftIconComponent
  export default Housekeeping
}
declare module '@swift/icons/ID' {
  export const ID: SwiftIconComponent
  export default ID
}
declare module '@swift/icons/IdFilled' {
  export const IdFilled: SwiftIconComponent
  export default IdFilled
}
declare module '@swift/icons/Image' {
  export const Image: SwiftIconComponent
  export default Image
}
declare module '@swift/icons/InfoCircle' {
  export const InfoCircle: SwiftIconComponent
  export default InfoCircle
}
declare module '@swift/icons/InfoCircleFilled' {
  export const InfoCircleFilled: SwiftIconComponent
  export default InfoCircleFilled
}
declare module '@swift/icons/InstagramFilled' {
  export const InstagramFilled: SwiftIconComponent
  export default InstagramFilled
}
declare module '@swift/icons/InternetBanking' {
  export const InternetBanking: SwiftIconComponent
  export default InternetBanking
}
declare module '@swift/icons/Keyboard' {
  export const Keyboard: SwiftIconComponent
  export default Keyboard
}
declare module '@swift/icons/KeyboardFilled' {
  export const KeyboardFilled: SwiftIconComponent
  export default KeyboardFilled
}
declare module '@swift/icons/Kitchen' {
  export const Kitchen: SwiftIconComponent
  export default Kitchen
}
declare module '@swift/icons/Lakeview' {
  export const Lakeview: SwiftIconComponent
  export default Lakeview
}
declare module '@swift/icons/Language' {
  export const Language: SwiftIconComponent
  export default Language
}
declare module '@swift/icons/Laundry' {
  export const Laundry: SwiftIconComponent
  export default Laundry
}
declare module '@swift/icons/LinkedinFilled' {
  export const LinkedinFilled: SwiftIconComponent
  export default LinkedinFilled
}
declare module '@swift/icons/Location' {
  export const Location: SwiftIconComponent
  export default Location
}
declare module '@swift/icons/LocationOn' {
  export const LocationOn: SwiftIconComponent
  export default LocationOn
}
declare module '@swift/icons/LocationOnFilled' {
  export const LocationOnFilled: SwiftIconComponent
  export default LocationOnFilled
}
declare module '@swift/icons/LogoutFilled' {
  export const LogoutFilled: SwiftIconComponent
  export default LogoutFilled
}
declare module '@swift/icons/Lounge' {
  export const Lounge: SwiftIconComponent
  export default Lounge
}
declare module '@swift/icons/LuggageFilled' {
  export const LuggageFilled: SwiftIconComponent
  export default LuggageFilled
}
declare module '@swift/icons/LuggageStorage' {
  export const LuggageStorage: SwiftIconComponent
  export default LuggageStorage
}
declare module '@swift/icons/Mail' {
  export const Mail: SwiftIconComponent
  export default Mail
}
declare module '@swift/icons/MailFilled' {
  export const MailFilled: SwiftIconComponent
  export default MailFilled
}
declare module '@swift/icons/Meeting' {
  export const Meeting: SwiftIconComponent
  export default Meeting
}
declare module '@swift/icons/MessageBlockFilled' {
  export const MessageBlockFilled: SwiftIconComponent
  export default MessageBlockFilled
}
declare module '@swift/icons/Mic' {
  export const Mic: SwiftIconComponent
  export default Mic
}
declare module '@swift/icons/MicFilled' {
  export const MicFilled: SwiftIconComponent
  export default MicFilled
}
declare module '@swift/icons/Microwave' {
  export const Microwave: SwiftIconComponent
  export default Microwave
}
declare module '@swift/icons/MoreCircle' {
  export const MoreCircle: SwiftIconComponent
  export default MoreCircle
}
declare module '@swift/icons/MoreFilled' {
  export const MoreFilled: SwiftIconComponent
  export default MoreFilled
}
declare module '@swift/icons/MoreHoriz' {
  export const MoreHoriz: SwiftIconComponent
  export default MoreHoriz
}
declare module '@swift/icons/MoreVert' {
  export const MoreVert: SwiftIconComponent
  export default MoreVert
}
declare module '@swift/icons/Morning' {
  export const Morning: SwiftIconComponent
  export default Morning
}
declare module '@swift/icons/MultipleUsers' {
  export const MultipleUsers: SwiftIconComponent
  export default MultipleUsers
}
declare module '@swift/icons/MultipleUsersFilled' {
  export const MultipleUsersFilled: SwiftIconComponent
  export default MultipleUsersFilled
}
declare module '@swift/icons/MyLocation' {
  export const MyLocation: SwiftIconComponent
  export default MyLocation
}
declare module '@swift/icons/MyLocationFilled' {
  export const MyLocationFilled: SwiftIconComponent
  export default MyLocationFilled
}
declare module '@swift/icons/MyTripsFilled' {
  export const MyTripsFilled: SwiftIconComponent
  export default MyTripsFilled
}
declare module '@swift/icons/NatureAndWildlife' {
  export const NatureAndWildlife: SwiftIconComponent
  export default NatureAndWildlife
}
declare module '@swift/icons/Navigation' {
  export const Navigation: SwiftIconComponent
  export default Navigation
}
declare module '@swift/icons/NearMe' {
  export const NearMe: SwiftIconComponent
  export default NearMe
}
declare module '@swift/icons/Night' {
  export const Night: SwiftIconComponent
  export default Night
}
declare module '@swift/icons/NoCabFilled' {
  export const NoCabFilled: SwiftIconComponent
  export default NoCabFilled
}
declare module '@swift/icons/NoFood' {
  export const NoFood: SwiftIconComponent
  export default NoFood
}
declare module '@swift/icons/NoLuggageFilled' {
  export const NoLuggageFilled: SwiftIconComponent
  export default NoLuggageFilled
}
declare module '@swift/icons/NoPower' {
  export const NoPower: SwiftIconComponent
  export default NoPower
}
declare module '@swift/icons/NoSeat' {
  export const NoSeat: SwiftIconComponent
  export default NoSeat
}
declare module '@swift/icons/NoSeatFilled' {
  export const NoSeatFilled: SwiftIconComponent
  export default NoSeatFilled
}
declare module '@swift/icons/NoShieldFilled' {
  export const NoShieldFilled: SwiftIconComponent
  export default NoShieldFilled
}
declare module '@swift/icons/NoVideo' {
  export const NoVideo: SwiftIconComponent
  export default NoVideo
}
declare module '@swift/icons/NonRefundable' {
  export const NonRefundable: SwiftIconComponent
  export default NonRefundable
}
declare module '@swift/icons/NonVeg' {
  export const NonVeg: SwiftIconComponent
  export default NonVeg
}
declare module '@swift/icons/Notifications' {
  export const Notifications: SwiftIconComponent
  export default Notifications
}
declare module '@swift/icons/OtherAmenities' {
  export const OtherAmenities: SwiftIconComponent
  export default OtherAmenities
}
declare module '@swift/icons/OutdoorActivity' {
  export const OutdoorActivity: SwiftIconComponent
  export default OutdoorActivity
}
declare module '@swift/icons/PantryFilled' {
  export const PantryFilled: SwiftIconComponent
  export default PantryFilled
}
declare module '@swift/icons/Parking' {
  export const Parking: SwiftIconComponent
  export default Parking
}
declare module '@swift/icons/PartialRefund' {
  export const PartialRefund: SwiftIconComponent
  export default PartialRefund
}
declare module '@swift/icons/Passport' {
  export const Passport: SwiftIconComponent
  export default Passport
}
declare module '@swift/icons/PassportFilled' {
  export const PassportFilled: SwiftIconComponent
  export default PassportFilled
}
declare module '@swift/icons/PasswordSMS' {
  export const PasswordSMS: SwiftIconComponent
  export default PasswordSMS
}
declare module '@swift/icons/PasswordSMSFilled' {
  export const PasswordSMSFilled: SwiftIconComponent
  export default PasswordSMSFilled
}
declare module '@swift/icons/PauseFilled' {
  export const PauseFilled: SwiftIconComponent
  export default PauseFilled
}
declare module '@swift/icons/PayLater' {
  export const PayLater: SwiftIconComponent
  export default PayLater
}
declare module '@swift/icons/PayWithPoints' {
  export const PayWithPoints: SwiftIconComponent
  export default PayWithPoints
}
declare module '@swift/icons/Person' {
  export const Person: SwiftIconComponent
  export default Person
}
declare module '@swift/icons/PersonAdd' {
  export const PersonAdd: SwiftIconComponent
  export default PersonAdd
}
declare module '@swift/icons/PersonFilled' {
  export const PersonFilled: SwiftIconComponent
  export default PersonFilled
}
declare module '@swift/icons/PetFriendly' {
  export const PetFriendly: SwiftIconComponent
  export default PetFriendly
}
declare module '@swift/icons/PlayArea' {
  export const PlayArea: SwiftIconComponent
  export default PlayArea
}
declare module '@swift/icons/PlayFilled' {
  export const PlayFilled: SwiftIconComponent
  export default PlayFilled
}
declare module '@swift/icons/Power' {
  export const Power: SwiftIconComponent
  export default Power
}
declare module '@swift/icons/PriceLockFilled' {
  export const PriceLockFilled: SwiftIconComponent
  export default PriceLockFilled
}
declare module '@swift/icons/Refresh' {
  export const Refresh: SwiftIconComponent
  export default Refresh
}
declare module '@swift/icons/Refrigerator' {
  export const Refrigerator: SwiftIconComponent
  export default Refrigerator
}
declare module '@swift/icons/Refundable' {
  export const Refundable: SwiftIconComponent
  export default Refundable
}
declare module '@swift/icons/Remove' {
  export const Remove: SwiftIconComponent
  export default Remove
}
declare module '@swift/icons/Replay' {
  export const Replay: SwiftIconComponent
  export default Replay
}
declare module '@swift/icons/Report' {
  export const Report: SwiftIconComponent
  export default Report
}
declare module '@swift/icons/RequestCallbackFilled' {
  export const RequestCallbackFilled: SwiftIconComponent
  export default RequestCallbackFilled
}
declare module '@swift/icons/Room' {
  export const Room: SwiftIconComponent
  export default Room
}
declare module '@swift/icons/RoomAmenities' {
  export const RoomAmenities: SwiftIconComponent
  export default RoomAmenities
}
declare module '@swift/icons/RoomArea' {
  export const RoomArea: SwiftIconComponent
  export default RoomArea
}
declare module '@swift/icons/RoomFilled' {
  export const RoomFilled: SwiftIconComponent
  export default RoomFilled
}
declare module '@swift/icons/RoomService' {
  export const RoomService: SwiftIconComponent
  export default RoomService
}
declare module '@swift/icons/RupeeCircle' {
  export const RupeeCircle: SwiftIconComponent
  export default RupeeCircle
}
declare module '@swift/icons/RupeeCircleFilled' {
  export const RupeeCircleFilled: SwiftIconComponent
  export default RupeeCircleFilled
}
declare module '@swift/icons/Safety' {
  export const Safety: SwiftIconComponent
  export default Safety
}
declare module '@swift/icons/SandTimeFilled' {
  export const SandTimeFilled: SwiftIconComponent
  export default SandTimeFilled
}
declare module '@swift/icons/ScanQR' {
  export const ScanQR: SwiftIconComponent
  export default ScanQR
}
declare module '@swift/icons/Schedule' {
  export const Schedule: SwiftIconComponent
  export default Schedule
}
declare module '@swift/icons/ScheduleFilled' {
  export const ScheduleFilled: SwiftIconComponent
  export default ScheduleFilled
}
declare module '@swift/icons/ScheduleFlexibleFilled' {
  export const ScheduleFlexibleFilled: SwiftIconComponent
  export default ScheduleFlexibleFilled
}
declare module '@swift/icons/Search' {
  export const Search: SwiftIconComponent
  export default Search
}
declare module '@swift/icons/SeatsLeftFilled' {
  export const SeatsLeftFilled: SwiftIconComponent
  export default SeatsLeftFilled
}
declare module '@swift/icons/Security' {
  export const Security: SwiftIconComponent
  export default Security
}
declare module '@swift/icons/SendMessageFilled' {
  export const SendMessageFilled: SwiftIconComponent
  export default SendMessageFilled
}
declare module '@swift/icons/Services' {
  export const Services: SwiftIconComponent
  export default Services
}
declare module '@swift/icons/Settings' {
  export const Settings: SwiftIconComponent
  export default Settings
}
declare module '@swift/icons/Share' {
  export const Share: SwiftIconComponent
  export default Share
}
declare module '@swift/icons/ShareIos' {
  export const ShareIos: SwiftIconComponent
  export default ShareIos
}
declare module '@swift/icons/Signal' {
  export const Signal: SwiftIconComponent
  export default Signal
}
declare module '@swift/icons/Smoking' {
  export const Smoking: SwiftIconComponent
  export default Smoking
}
declare module '@swift/icons/SortFilled' {
  export const SortFilled: SwiftIconComponent
  export default SortFilled
}
declare module '@swift/icons/Spa' {
  export const Spa: SwiftIconComponent
  export default Spa
}
declare module '@swift/icons/Spoon' {
  export const Spoon: SwiftIconComponent
  export default Spoon
}
declare module '@swift/icons/Sports' {
  export const Sports: SwiftIconComponent
  export default Sports
}
declare module '@swift/icons/SportsBasketball' {
  export const SportsBasketball: SwiftIconComponent
  export default SportsBasketball
}
declare module '@swift/icons/Star' {
  export const Star: SwiftIconComponent
  export default Star
}
declare module '@swift/icons/StarFilled' {
  export const StarFilled: SwiftIconComponent
  export default StarFilled
}
declare module '@swift/icons/StarShieldFilled' {
  export const StarShieldFilled: SwiftIconComponent
  export default StarShieldFilled
}
declare module '@swift/icons/Station' {
  export const Station: SwiftIconComponent
  export default Station
}
declare module '@swift/icons/Swap' {
  export const Swap: SwiftIconComponent
  export default Swap
}
declare module '@swift/icons/SwiftCreditFilled' {
  export const SwiftCreditFilled: SwiftIconComponent
  export default SwiftCreditFilled
}
declare module '@swift/icons/SwiftMoney' {
  export const SwiftMoney: SwiftIconComponent
  export default SwiftMoney
}
declare module '@swift/icons/SwiftMoneyCircleFilled' {
  export const SwiftMoneyCircleFilled: SwiftIconComponent
  export default SwiftMoneyCircleFilled
}
declare module '@swift/icons/SwiftMoneyFilled' {
  export const SwiftMoneyFilled: SwiftIconComponent
  export default SwiftMoneyFilled
}
declare module '@swift/icons/SwiftMoneyMax' {
  export const SwiftMoneyMax: SwiftIconComponent
  export default SwiftMoneyMax
}
declare module '@swift/icons/SwiftMoneyMaxFilled' {
  export const SwiftMoneyMaxFilled: SwiftIconComponent
  export default SwiftMoneyMaxFilled
}
declare module '@swift/icons/SwiftMoneyMaxFilled1' {
  export const SwiftMoneyMaxFilled1: SwiftIconComponent
  export default SwiftMoneyMaxFilled1
}
declare module '@swift/icons/Swimming' {
  export const Swimming: SwiftIconComponent
  export default Swimming
}
declare module '@swift/icons/SwimmingPool' {
  export const SwimmingPool: SwiftIconComponent
  export default SwimmingPool
}
declare module '@swift/icons/Sync' {
  export const Sync: SwiftIconComponent
  export default Sync
}
declare module '@swift/icons/Tag' {
  export const Tag: SwiftIconComponent
  export default Tag
}
declare module '@swift/icons/ThumbDown' {
  export const ThumbDown: SwiftIconComponent
  export default ThumbDown
}
declare module '@swift/icons/ThumbUp' {
  export const ThumbUp: SwiftIconComponent
  export default ThumbUp
}
declare module '@swift/icons/ThumbsDownFilled' {
  export const ThumbsDownFilled: SwiftIconComponent
  export default ThumbsDownFilled
}
declare module '@swift/icons/ThumbsUpFilled' {
  export const ThumbsUpFilled: SwiftIconComponent
  export default ThumbsUpFilled
}
declare module '@swift/icons/TicketFilled' {
  export const TicketFilled: SwiftIconComponent
  export default TicketFilled
}
declare module '@swift/icons/TicketHorizontal' {
  export const TicketHorizontal: SwiftIconComponent
  export default TicketHorizontal
}
declare module '@swift/icons/TicketHorizontalFilled' {
  export const TicketHorizontalFilled: SwiftIconComponent
  export default TicketHorizontalFilled
}
declare module '@swift/icons/TotalDistance' {
  export const TotalDistance: SwiftIconComponent
  export default TotalDistance
}
declare module '@swift/icons/Train' {
  export const Train: SwiftIconComponent
  export default Train
}
declare module '@swift/icons/TrainCT' {
  export const TrainCT: SwiftIconComponent
  export default TrainCT
}
declare module '@swift/icons/TrainCTFilled' {
  export const TrainCTFilled: SwiftIconComponent
  export default TrainCTFilled
}
declare module '@swift/icons/TrainFilled' {
  export const TrainFilled: SwiftIconComponent
  export default TrainFilled
}
declare module '@swift/icons/Transport' {
  export const Transport: SwiftIconComponent
  export default Transport
}
declare module '@swift/icons/TrendDown' {
  export const TrendDown: SwiftIconComponent
  export default TrendDown
}
declare module '@swift/icons/TrendUp' {
  export const TrendUp: SwiftIconComponent
  export default TrendUp
}
declare module '@swift/icons/TrendUpCircle' {
  export const TrendUpCircle: SwiftIconComponent
  export default TrendUpCircle
}
declare module '@swift/icons/Tune' {
  export const Tune: SwiftIconComponent
  export default Tune
}
declare module '@swift/icons/TwitterFilled' {
  export const TwitterFilled: SwiftIconComponent
  export default TwitterFilled
}
declare module '@swift/icons/Upload' {
  export const Upload: SwiftIconComponent
  export default Upload
}
declare module '@swift/icons/Valet' {
  export const Valet: SwiftIconComponent
  export default Valet
}
declare module '@swift/icons/Veg' {
  export const Veg: SwiftIconComponent
  export default Veg
}
declare module '@swift/icons/Video' {
  export const Video: SwiftIconComponent
  export default Video
}
declare module '@swift/icons/VideoFilled' {
  export const VideoFilled: SwiftIconComponent
  export default VideoFilled
}
declare module '@swift/icons/VideoGaming' {
  export const VideoGaming: SwiftIconComponent
  export default VideoGaming
}
declare module '@swift/icons/View' {
  export const View: SwiftIconComponent
  export default View
}
declare module '@swift/icons/VolumeOff' {
  export const VolumeOff: SwiftIconComponent
  export default VolumeOff
}
declare module '@swift/icons/VolumeUp' {
  export const VolumeUp: SwiftIconComponent
  export default VolumeUp
}
declare module '@swift/icons/Wallet' {
  export const Wallet: SwiftIconComponent
  export default Wallet
}
declare module '@swift/icons/WalletFilled' {
  export const WalletFilled: SwiftIconComponent
  export default WalletFilled
}
declare module '@swift/icons/WaterSports' {
  export const WaterSports: SwiftIconComponent
  export default WaterSports
}
declare module '@swift/icons/Wellness' {
  export const Wellness: SwiftIconComponent
  export default Wellness
}
declare module '@swift/icons/Wifi' {
  export const Wifi: SwiftIconComponent
  export default Wifi
}
declare module '@swift/icons/WifiOff' {
  export const WifiOff: SwiftIconComponent
  export default WifiOff
}
declare module '@swift/icons/YoutubeFilled' {
  export const YoutubeFilled: SwiftIconComponent
  export default YoutubeFilled
}
declare module '@swift/icons/ZoomIn' {
  export const ZoomIn: SwiftIconComponent
  export default ZoomIn
}
declare module '@swift/icons/ZoomOut' {
  export const ZoomOut: SwiftIconComponent
  export default ZoomOut
}
