"use client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import { SubscriptionPlans } from "@/types/subscription-plans";
import MultiSelect from "@/components/FormElements/MultiSelect";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import swal from "sweetalert";
import { ReviewQuestion } from "@/types/review-questions";
import { PromoCode } from "@/types/promo-code";
import { fetchCoupons } from "@/api-services/coupon";
import Loading from "@/components/Loading";
const CouponTable = () => {
  const initialInputs = {
    name: '',
    description: '',
    code: '',
    priceType: '',
    value: 0,
    cartValue: 0,
    redeemedCount: 0,
    quantity: 0,
    validFrom: '',
    validTo: '',
    maxDiscount: 0,
    type: ''
  };
  const searchParams = useSearchParams();
  const search = searchParams.get('query');
  const [query, setQuery] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [modal, setModal] = useState(false);
  const [formInputs, setFormInputs] = useState(initialInputs);
  const [ID, setID] = useState<string | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  useEffect(() => {
    setQuery(query);
  }, [search]);

  const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ['promo-codes', query, pageNo],
    queryFn: () => fetchCoupons({
      // query: debouncedTerm,
      documentLimit: 20,
      pageNumber: pageNo,
    }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // setButtonLoading(true);
      if (isEditMode) {
        const response = await apiRequest.put(`/admin/promo-codes/${ID}`, { ...formInputs });
        if (response.status === 200 && response.data.statusCode === 202) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
        } else {
          toast.error(response?.data?.message);
        }
      } else {
        const response = await apiRequest.post('/admin/promo-codes', { ...formInputs });
        if (response.status === 200 && response.data.statusCode === 201) {
          toast.success(response?.data?.message);
          refetch();
          setModal(false);
          setFormInputs(initialInputs);
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error: any) {
      console.log("catch :::", error)
      handleClientApiErrors(error);
    } finally {
      // setButtonLoading(false);
    }
  }
  const performDelete = async (id: string) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this item?",
        icon: "warning",
        dangerMode: true,
        buttons: {
          cancel: true,
          confirm: true,
        },
      });
      if (willDelete) {
        const response = await apiRequest.delete(`admin/promo-codes/${id}`);
        if (response.status === 200 && response.data.statusCode === 204) {
          refetch();
          toast.success(response?.data?.message);
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error: any) {
      handleClientApiErrors(error);
    } finally {

    }
  }
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              All Coupons
            </h4>
          </div>
          <div className="flex">
            <Button.IconButton text="Add Coupon" variant="primary" onClick={() => {
              setModal(true)
              setEditMode(false);
              setFormInputs(initialInputs)
            }} icon={<svg className="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill=""></path></svg>} />
          </div>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className={`${modal ? '' : 'hidden'} fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}>
            <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
              <button className="absolute right-1 top-1 sm:right-5 sm:top-5" type="button" onClick={() => setModal(false)}>
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                </svg>
              </button>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3" >
                  <label htmlFor="name" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Name</label>
                  <input id="name" name="name" type="text" placeholder="Enter name" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Description</label>
                  <textarea name="description" id="description" required={true} cols={30} rows={4} placeholder="Enter description" className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" value={formInputs.description} onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })}></textarea>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label htmlFor="code" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Coupon Code</label>
                    <input id="code" placeholder="Enter code" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="text" name="code" value={formInputs.code} onChange={(e) => setFormInputs({ ...formInputs, code: e.target.value.toUpperCase() })} />
                  </div>
                  <div >
                    <label htmlFor="discount" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Discount value</label>
                    <input id="discount" step={0.01} placeholder="Enter price" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="discount" value={formInputs.value} onChange={(e) => setFormInputs({ ...formInputs, value: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Price Type</label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon />
                      </span>
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, priceType: e.target.value })} value={formInputs.priceType}>
                        <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                        <option value="fixed" className="text-body dark:text-bodydark">Fixed ₹</option>
                        <option value="percent" className="text-body dark:text-bodydark">Percent %</option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label htmlFor="maxDiscount" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Max discount</label>
                    <input id="maxDiscount" step={0.01} placeholder="Enter code" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="maxDiscount" value={formInputs.maxDiscount} onChange={(e) => setFormInputs({ ...formInputs, maxDiscount: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                    <label htmlFor="cartValue" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Min. Cart/Order Value</label>
                    <input id="cartValue" step={0.01} placeholder="Enter price" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="cartValue" value={formInputs.cartValue} onChange={(e) => setFormInputs({ ...formInputs, cartValue: parseFloat(e.target.value) })} />
                  </div>
                  <div>
                    <label htmlFor="quantity" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Quantity</label>
                    <input id="quantity" step={1} placeholder="Enter quantity" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="number" name="quantity" value={formInputs.quantity} onChange={(e) => setFormInputs({ ...formInputs, quantity: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Type</label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon />
                      </span>
                      <select className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white" required={true} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} value={formInputs.type}>
                        <option value="" disabled={false} className="text-body dark:text-bodydark">--Please select--</option>
                        {/* <option value="subscription" className="text-body dark:text-bodydark">Subscription</option> */}
                        <option value="booking" className="text-body dark:text-bodydark">Booking</option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="validFrom" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Valid from</label>
                    <input id="validFrom" placeholder="Enter valid from date" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="date" name="validFrom" value={formInputs.validFrom} onChange={(e) => setFormInputs({ ...formInputs, validFrom: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="validTo" className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">Valid To </label>
                    <input id="validTo" placeholder="Enter valid to date" required={true} className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary" type="date" name="validTo" value={formInputs.validTo} onChange={(e) => setFormInputs({ ...formInputs, validTo: e.target.value })} min={formInputs.validFrom} />
                  </div>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4.5 py-2.5 font-medium text-white hover:bg-opacity-90">
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </form>
            </div>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Title/
                  Description
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Min Cart Value
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Price value
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Redeemed Count
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Coupon Quantity
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Validity
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Created
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                isFetching ?
                  <tr >
                    <td colSpan={8} >
                      <Loading />
                    </td>
                  </tr> :
                  <>
                    {data && data.data.map((data, key) => {
                      const validFrom = data.validFrom && data.validFrom ? data.validFrom : '';
                      const validTo = data.validTo && data.validTo ? data.validTo : '';
                      const currentDate = new Date();
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <div className="flex flex-col gap-1">
                              <h5 className="font-semibold text-black dark:text-white">
                                {data.name}
                                <small className="text-xs capitalize"> ({data.code})</small>
                              </h5>
                              <p className="text-xs text-black dark:text-white mb-1">{data.description}</p>
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {'₹'}{data && data.cartValue}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              <h5 className="font-semibold text-meta-3 dark:text-white">
                                {data && data.priceType === "fixed" ? <>{'₹'}{data.value}</> : null}
                                {data && data.priceType === 'percent' ? <>{data.value}{'%'}</> : null}

                              </h5>
                              <p className="text-xs text-black dark:text-white mb-1 capitalize">
                                Max Discount <b>{'₹'}{data && data.maxDiscount}</b>
                              </p>
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {data && data.redeemedCount}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {(data && data.quantity === -1) ? <>Unlimited</> : data.quantity}
                            </p>
                          </td>

                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-xs font-semibold">
                              {moment(validFrom).format('ddd DD, MMM YYYY hh:mm:ss A')} -<br /> {moment(validTo).format('ddd DD, MMM YYYY hh:mm:ss A')}
                            </p>
                            <p className="text-xs font-medium">
                              {
                                (currentDate > new Date(validTo)) ? <p className="text-xs  text-meta-1 dark:text-white">Expired {moment(validTo).fromNow()}</p> :
                                  <p className="text-xs text-meta-3 dark:text-white">Expire   {moment(validTo).fromNow()}</p>
                              }
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-xs font-semibold">
                              {moment(data.createdAt).format('ddd DD, MMM YYYY hh:mm:ss A')}
                            </p>
                            <p className="text-xs font-medium">
                              {moment(data.createdAt).fromNow()}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <Button.Delete onClick={() => {
                                performDelete(data._id);
                              }} />
                              <Button.Edit onClick={() => {
                                setID(data._id);
                                setModal(true);
                                setEditMode(true);
                                setFormInputs({
                                  ...formInputs,
                                  name: data.name,
                                  description: data.description,
                                  code: data.code,
                                  priceType: data.priceType,
                                  value: data.value,
                                  cartValue: data.cartValue,
                                  redeemedCount: data.redeemedCount,
                                  quantity: data.quantity,
                                  validFrom: moment(data.validFrom).format('YYYY-MM-DD'),
                                  validTo: moment(data.validTo).format('YYYY-MM-DD'),
                                  maxDiscount: data.maxDiscount,
                                  type: data.type
                                })
                              }} />
                              {/* <Button.View onClick={() => { route.push(`/subscriptions/${data._id}`) }} /> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </>
              }
            </tbody>
          </table>
          <Paginator pageNo={pageNo} totalPages={totalPages} totalResources={totalResources} onPageChange={(e, pageNo) => setPageNo(pageNo)} />
        </div>
      </div >
    </div >
  );
};

const DownArrowIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.8">
      <path fillRule="evenodd" clipRule="evenodd" d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill="#637381"></path></g>
    </svg>
  )
}
const ListIcon = () => {
  return (
    <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_130_9728)" ><path d="M3.45928 0.984375H1.6874C1.04053 0.984375 0.478027 1.51875 0.478027 2.19375V3.96563C0.478027 4.6125 1.0124 5.175 1.6874 5.175H3.45928C4.10615 5.175 4.66865 4.64063 4.66865 3.96563V2.16562C4.64053 1.51875 4.10615 0.984375 3.45928 0.984375ZM3.3749 3.88125H1.77178V2.25H3.3749V3.88125Z" fill=""></path><path d="M7.22793 3.71245H16.8748C17.2123 3.71245 17.5217 3.4312 17.5217 3.06558C17.5217 2.69995 17.2404 2.4187 16.8748 2.4187H7.22793C6.89043 2.4187 6.58105 2.69995 6.58105 3.06558C6.58105 3.4312 6.89043 3.71245 7.22793 3.71245Z" fill=""></path><path d="M3.45928 6.75H1.6874C1.04053 6.75 0.478027 7.28437 0.478027 7.95937V9.73125C0.478027 10.3781 1.0124 10.9406 1.6874 10.9406H3.45928C4.10615 10.9406 4.66865 10.4062 4.66865 9.73125V7.95937C4.64053 7.28437 4.10615 6.75 3.45928 6.75ZM3.3749 9.64687H1.77178V8.01562H3.3749V9.64687Z" fill=""></path><path d="M16.8748 8.21252H7.22793C6.89043 8.21252 6.58105 8.49377 6.58105 8.8594C6.58105 9.22502 6.86231 9.47815 7.22793 9.47815H16.8748C17.2123 9.47815 17.5217 9.1969 17.5217 8.8594C17.5217 8.5219 17.2123 8.21252 16.8748 8.21252Z" fill=""></path><path d="M3.45928 12.8531H1.6874C1.04053 12.8531 0.478027 13.3875 0.478027 14.0625V15.8344C0.478027 16.4813 1.0124 17.0438 1.6874 17.0438H3.45928C4.10615 17.0438 4.66865 16.5094 4.66865 15.8344V14.0625C4.64053 13.3875 4.10615 12.8531 3.45928 12.8531ZM3.3749 15.75H1.77178V14.1188H3.3749V15.75Z" fill=""></path><path d="M16.8748 14.2875H7.22793C6.89043 14.2875 6.58105 14.5687 6.58105 14.9344C6.58105 15.3 6.86231 15.5812 7.22793 15.5812H16.8748C17.2123 15.5812 17.5217 15.3 17.5217 14.9344C17.5217 14.5687 17.2123 14.2875 16.8748 14.2875Z" fill=""></path></g><defs><clipPath id="clip0_130_9728"><rect width="18" height="18" fill="white"></rect></clipPath></defs></svg>
  )
}
export default CouponTable;
