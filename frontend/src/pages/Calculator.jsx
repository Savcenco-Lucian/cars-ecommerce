import { Helmet } from '@vuer-ai/react-helmet-async';
import { MdDiscount } from "react-icons/md";
import { FaPercentage, FaCalendarAlt } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

// helpers
const toNum = (v) => {
    const n = typeof v === 'number' ? v : Number(v || 0);
    return Number.isFinite(n) ? n : 0;
};

// keep only digits (for price, period, down)
const sanitizeInt = (raw) => (raw === "" ? "" : raw.replace(/[^\d]/g, ""));
// remove leading zeros but keep a single "0" if that's all there is
const stripLeadingZerosInt = (s) => (s === "" ? "" : s.replace(/^0+(?=\d)/, ""));

// allow only digits and a single dot (for rate)
const sanitizeDecimal = (raw) => {
    if (raw === "") return "";
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const firstDot = cleaned.indexOf('.');
    if (firstDot === -1) return cleaned;
    const head = cleaned.slice(0, firstDot + 1);
    const tail = cleaned.slice(firstDot + 1).replace(/\./g, '');
    return head + tail;
};
// normalize decimal: strip leading zeros from integer part but keep "0." if needed
const normalizeDecimal = (s) => {
    if (s === "") return "";
    const i = s.indexOf('.');
    if (i !== -1) {
        let intPart = s.slice(0, i).replace(/^0+(?=\d)/, "");
        if (intPart === "") intPart = "0";         // ensure "0.x" shape when user types "."
        const frac = s.slice(i + 1);
        return intPart + "." + frac;
    }
    return s.replace(/^0+(?=\d)/, "");
};

const Calculator = () => {
    const {priceFromParams} = useParams();

    

    // values as strings for the "0 when empty" UX
    const [price, setPrice] = useState("1");
    const [rate, setRate] = useState("2.5");
    const [period, setPeriod] = useState("36");
    const [down, setDown] = useState("10000");

    useEffect(() => {
        setPrice(priceFromParams);
    }, [priceFromParams])

    const [errors, setErrors] = useState({}); // { price, rate, period, down, general }

    const priceNum = toNum(price);
    const rateNum = toNum(rate);
    const periodNum = toNum(period);
    const downNum = toNum(down);

    // validations
    const validations = useMemo(() => {
        const e = {};
        if (price === "" || priceNum < 0) e.price = "Price cannot be lower than 0.";
        if (rate === "" || rateNum < 0) e.rate = "Interest rate cannot be lower than 0.";
        if (period === "" || periodNum < 0) e.period = "Period cannot be lower than 0.";
        if (down === "" || downNum < 0) e.down = "Down payment cannot be lower than 0.";
        if (downNum > 0 && downNum < 10000) e.down = "Down payment must be at least 10,000.";
        if (priceNum > 0 && downNum > 0 && priceNum <= downNum) e.general = "Price must be greater than down payment.";
        if (priceNum === 0 || rateNum === 0 || periodNum === 0 || downNum === 0) e.general = e.general || "All inputs must be greater than 0.";
        return e;
    }, [price, rate, period, down, priceNum, rateNum, periodNum, downNum]);

    const hasBlockingError = useMemo(() => Boolean(
        validations.price || validations.rate || validations.period || validations.down || validations.general
    ), [validations]);

    // calculation
    const principal = Math.max(0, priceNum - downNum);
    const monthlyRate = rateNum / 100 / 12;

    const monthlyPayment = useMemo(() => {
        if (hasBlockingError) return 0;
        if (monthlyRate === 0) return periodNum > 0 ? principal / periodNum : 0;
        const r = monthlyRate, n = periodNum;
        const numerator = principal * r * Math.pow(1 + r, n);
        const denominator = Math.pow(1 + r, n) - 1;
        return denominator !== 0 ? numerator / denominator : 0;
    }, [principal, monthlyRate, periodNum, hasBlockingError]);

    const totalPayments = useMemo(
        () => (hasBlockingError ? 0 : monthlyPayment * periodNum + downNum),
        [monthlyPayment, periodNum, downNum, hasBlockingError]
    );
    const totalInterest = useMemo(() => hasBlockingError ? 0 : Math.max(0, totalPayments - principal - downNum), [totalPayments, principal, hasBlockingError]);

    // change handlers that strip leading zeros (so "0" disappears as you type)
    const handlePriceChange = (e) => {
        const sanitized = sanitizeInt(e.target.value);
        setPrice(stripLeadingZerosInt(sanitized));
    };
    const handlePeriodChange = (e) => {
        const sanitized = sanitizeInt(e.target.value);
        setPeriod(stripLeadingZerosInt(sanitized));
    };
    const handleDownChange = (e) => {
        const sanitized = sanitizeInt(e.target.value);
        setDown(stripLeadingZerosInt(sanitized));
    };
    const handleRateChange = (e) => {
        const sanitized = sanitizeDecimal(e.target.value);
        setRate(normalizeDecimal(sanitized));
    };

    // snap back to "0" if user leaves a field empty
    const handleBlurToZero = (value, setter) => {
        if (value === "") setter("0");
    };

    useEffect(() => { setErrors(validations); }, [validations]);

    const money = (n) => n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });

    return (
        <>
            <Helmet>
                <title>Loan Calculator | Zoom Vintage Classics</title>
                <meta name="description" content="We offer 2.5% interest rate per year, with a minimum 10,000$ down payment." />
            </Helmet>

            <section className='relative'>
                <div className='absolute inset-0 bg-[url(/shipping.jpg)] bg-cover bg-center'></div>
                <div className='absolute inset-0 bg-black/70'></div>
                <div className="relative flex justify-center h-full w-full pt-[150px] pb-[100px]">
                    <h1 className='text-[45px] sm:text-[61px] px-[15px] text-white font-muli font-[900] tracking-wide text-center'>
                        Loan Calculator
                    </h1>
                </div>
            </section>

            <section className="pt-[70px] sm:pt-[90px] pb-[100px] sm:container sm:mx-auto px-[10px] font-muli ">
                <div className="rounded-2xl bg-gray-200 flex flex-col gap-[30px] justify-center items-center py-[40px] px-[15px]">
                    <p className='text-[30px] sm:text-[50px] text-[#222732] font-[900] tracking-wide text-center'>Loan Calculator</p>
                    <p className='text-[#222732] text-center max-w-[700px]'>
                        Use our loan calculator to calculate payments over the life of your loan. Enter your information to see how much your monthly payments could be. You can adjust length of loan, down payment and interest rate to see how those changes raise or lower your payments. <br /> <u>We offer 2.5% interest rate per year, with a minimum 10,000$ down payment.</u>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] w-full max-w-[900px]">
                        {/* Price */}
                        <div className="flex flex-col gap-[10px] w-full">
                            <p className='font-[700]'>Price<span className='text-[#d5ab63]'>*</span></p>
                            <div className={`flex items-center rounded-lg border-[1px] ${errors.price ? 'border-red-400' : 'border-gray-200'} shadow-md bg-white`}>
                                <div className="border-r-[1px] border-gray-200 text-[#d5ab63] flex justify-center items-center p-[13px] text-2xl"><MdDiscount /></div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="price"
                                    value={price === "" ? "0" : price}
                                    onChange={handlePriceChange}
                                    onBlur={() => handleBlurToZero(price, setPrice)}
                                    className='outline-none p-[13px] w-full'
                                />
                            </div>
                            {errors.price && <p className='text-red-500 text-sm'>{errors.price}</p>}
                        </div>

                        {/* Rate */}
                        <div className="flex flex-col gap-[10px] w-full">
                            <p className='font-[700]'>Interest Rate<span className='text-[#d5ab63]'>*</span></p>
                            <div className={`flex items-center rounded-lg border-[1px] ${errors.rate ? 'border-red-400' : 'border-gray-200'} shadow-md bg-white`}>
                                <div className="border-r-[1px] border-gray-200 text-[#d5ab63] flex justify-center items-center p-[13px] text-2xl"><FaPercentage /></div>
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    name="rate"
                                    value={rate === "" ? "0" : rate}
                                    onChange={handleRateChange}
                                    onBlur={() => handleBlurToZero(rate, setRate)}
                                    className='outline-none p-[13px] w-full'
                                />
                            </div>
                            {errors.rate && <p className='text-red-500 text-sm'>{errors.rate}</p>}
                        </div>

                        {/* Period */}
                        <div className="flex flex-col gap-[10px] w-full">
                            <p className='font-[700]'>Period (months)<span className='text-[#d5ab63]'>*</span></p>
                            <div className={`flex items-center rounded-lg border-[1px] ${errors.period ? 'border-red-400' : 'border-gray-200'} shadow-md bg-white`}>
                                <div className="border-r-[1px] border-gray-200 text-[#d5ab63] flex justify-center items-center p-[13px] text-2xl"><FaCalendarAlt /></div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="period"
                                    value={period === "" ? "0" : period}
                                    onChange={handlePeriodChange}
                                    onBlur={() => handleBlurToZero(period, setPeriod)}
                                    className='outline-none p-[13px] w-full'
                                />
                            </div>
                            {errors.period && <p className='text-red-500 text-sm'>{errors.period}</p>}
                        </div>

                        {/* Down */}
                        <div className="flex flex-col gap-[10px] w-full">
                            <p className='font-[700]'>Down Payment<span className='text-[#d5ab63]'>*</span></p>
                            <div className={`flex items-center rounded-lg border-[1px] ${errors.down ? 'border-red-400' : 'border-gray-200'} shadow-md bg-white`}>
                                <div className="border-r-[1px] border-gray-200 text-[#d5ab63] flex justify-center items-center p-[13px] text-2xl"><FaDollarSign /></div>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="down"
                                    value={down === "" ? "0" : down}
                                    onChange={handleDownChange}
                                    onBlur={() => handleBlurToZero(down, setDown)}
                                    className='outline-none p-[13px] w-full'
                                />
                            </div>
                            {errors.down && <p className='text-red-500 text-sm'>{errors.down}</p>}
                        </div>
                    </div>

                    {/* Global error / blocker */}
                    {errors.general && (
                        <div className="w-full max-w-[900px] rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* Results */}
                    <div className="w-full max-w-[900px] mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="font-semibold text-[#222732]">Monthly Payment</p>
                            <p className="text-2xl font-extrabold tracking-wide text-[#d5ab63]">
                                {hasBlockingError ? "—" : `$${money(monthlyPayment)}`}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="font-semibold text-[#222732]">Total Interest</p>
                            <p className="text-2xl font-extrabold tracking-wide text-[#d5ab63]">
                                {hasBlockingError ? "—" : `$${money(totalInterest)}`}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="font-semibold text-[#222732]">Total Payments</p>
                            <p className="text-2xl font-extrabold tracking-wide text-[#d5ab63]">
                                {hasBlockingError ? "—" : `$${money(totalPayments)}`}
                            </p>
                        </div>
                    </div>

                    
                    <p className="text-xs text-[#222732] opacity-70 mt-2 text-center max-w-[700px]">Title and other fees and incentives are not included in this calculation, which is an estimate only. Monthly payment estimates are for informational purpose and do not represent a financing offer from the seller of this vehicle. Other taxes may apply.</p>
                </div>
            </section>
        </>
    );
};

export default Calculator;
