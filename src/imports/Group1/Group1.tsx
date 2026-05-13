import svgPaths from "./svg-wa1fdkbead";
import imgImage1 from "./c2f1f828417fb5a7a6ec38e739df5d359d6431bc.png";
import imgEllipse1 from "./24ecce4f34ea964d966110252b5c657e874d5c27.png";

function FillShadow() {
  return (
    <div className="absolute inset-0 rounded-[20px] shadow-[0px_8px_40px_0px_rgba(0,0,0,0.12)]" data-name="Fill + Shadow">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
        <div className="absolute bg-[#0b1f1a] inset-0 mix-blend-color-dodge rounded-[20px]" />
        <div className="absolute bg-[rgba(11,31,26,0.7)] inset-0 rounded-[20px]" />
      </div>
    </div>
  );
}

function GlassEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none rounded-[20px]" data-name="Glass Effect">
      <div aria-hidden="true" className="absolute bg-[rgba(0,0,0,0)] inset-0 rounded-[20px]" />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_4px_14px_0px_rgba(0,0,0,0.25)]" />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute inset-[8.33%_10.42%]" data-name="Mask group">
      <div className="absolute inset-[-3.24%_-3.41%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.2917 32.8333">
          <g id="Mask group">
            <mask height="33" id="mask0_1_769" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }} width="32" x="0" y="0">
              <g id="Group">
                <g id="Group_2">
                  <path d={svgPaths.p24b51c80} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p31e79600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinejoin="round" strokeWidth="2" />
                  <path d={svgPaths.p53d6780} id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
              </g>
            </mask>
            <g mask="url(#mask0_1_769)">
              <path d={svgPaths.p20419880} fill="var(--fill-0, #8A8A8A)" id="Vector_4" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Desktop({ className }: { className?: string }) {
  return (
    <div className={className || "absolute bg-white h-[1024px] left-0 overflow-clip top-0 w-[1440px]"} data-name="Desktop - 1">
      <div className="absolute bg-[#0b1f1a] content-stretch flex flex-col h-[1024px] items-start left-0 pb-[10px] pr-[16px] top-0 w-[414px]" data-name="Sidebar">
        <FillShadow />
        <GlassEffect />
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[22px] left-[118px] text-[24px] text-white top-[957px] whitespace-nowrap">Indra Adhikari</p>
      <div className="absolute h-[97px] left-[22px] top-[44px] w-[98px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold leading-[22px] left-[145px] text-[40px] text-white top-[60px] whitespace-nowrap">BBAS</p>
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[22px] left-[145px] text-[#9db9a4] text-[20px] top-[105px] whitespace-nowrap">System Administrator</p>
      <p className="absolute font-['Manrope:Regular',sans-serif] font-normal leading-[22px] left-[118px] text-[#9db9a4] text-[16px] top-[979px] whitespace-nowrap">System Administrator</p>
      <div className="absolute h-[59px] left-[22px] top-[241px] w-[370px]" data-name="Component 1">
        <div className="absolute bg-[#c2410c] inset-0 rounded-[10px]" />
        <div className="absolute aspect-[24/24] left-[4.86%] right-[85.14%] top-[11px]" data-name="material-symbols:dashboard">
          <div className="absolute inset-[12.5%]" data-name="Vector">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.75 27.75">
              <path d={svgPaths.p17e44080} fill="var(--fill-0, #F5F5F5)" id="Vector" />
            </svg>
          </div>
        </div>
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[20px] text-white whitespace-nowrap">Dashboard</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[309px] w-[370px]" data-name="Component 2">
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">Assessments</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[377px] w-[370px]" data-name="Component 3">
        <div className="absolute aspect-[24/24] left-[4.86%] right-[85.14%] top-[11px]" data-name="material-symbols:dashboard" />
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">Farm registry</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[445px] w-[370px]" data-name="Component 4">
        <div className="absolute aspect-[24/24] left-[4.86%] right-[85.14%] top-[11px]" data-name="material-symbols:dashboard" />
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">Non-compliance</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[513px] w-[370px]" data-name="Component 5">
        <div className="absolute aspect-[24/24] left-[4.86%] right-[85.14%] top-[11px]" data-name="material-symbols:dashboard" />
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">Reports</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[581px] w-[370px]" data-name="Component 6">
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">Risk map</p>
      </div>
      <div className="absolute h-[59px] left-[22px] top-[649px] w-[370px]" data-name="Component 7">
        <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[30.51%_52.97%_32.2%_18.38%] leading-[22px] text-[#8a8a8a] text-[20px] whitespace-nowrap">User Management</p>
      </div>
      <div className="absolute h-0 left-[22px] top-[201px] w-[370px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 370 1">
            <line id="Line 1" stroke="var(--stroke-0, #8A8A8A)" x2="370" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[45px] size-[24px] top-[325px]" data-name="material-symbols-light:book-6-rounded">
        <div className="absolute inset-[-25%_-33.33%_-25%_-16.67%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
            <path d={svgPaths.p1cd48c40} fill="var(--fill-0, #EBEBF5)" fillOpacity="0.7" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[40px] size-[37px] top-[387px]" data-name="gravity-ui:house-fill">
        <div className="absolute inset-[8.03%_9.38%_9.38%_9.37%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.0625 30.5615">
            <path d={svgPaths.p2e4b5500} fill="var(--fill-0, #8A8A8A)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[40px] size-[37px] top-[455px]" data-name="mynaui:flag-solid">
        <div className="absolute inset-[9.37%_13.54%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.9792 30.0626">
            <path d={svgPaths.p3eb5d3f0} fill="var(--fill-0, #8A8A8A)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[41px] size-[37px] top-[523px]" data-name="icon-park-solid:table-report">
        <MaskGroup />
      </div>
      <div className="absolute left-[37px] size-[37px] top-[592px]" data-name="tdesign:map-filled">
        <div className="absolute inset-[8.9%_8.33%_8.91%_8.33%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.8333 30.4094">
            <path d={svgPaths.p490b180} fill="var(--fill-0, #8A8A8A)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[35px] size-[37px] top-[659px]" data-name="gridicons:multiple-users">
        <div className="absolute inset-[16.67%_0]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 24.6667">
            <path d={svgPaths.p13f3fa00} fill="var(--fill-0, #8A8A8A)" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-0 top-[916px] w-[414px]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 414 1">
            <line id="Line 2" stroke="var(--stroke-0, #8A8A8A)" x2="414" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[37px] size-[65px] top-[946px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="65" src={imgEllipse1} width="65" />
      </div>
      <div className="absolute left-[345px] size-[39px] top-[959px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
          <circle cx="19.5" cy="19.5" fill="var(--fill-0, #808080)" id="Ellipse 2" r="19.5" />
        </svg>
      </div>
      <div className="absolute left-[351px] size-[27px] top-[965px]" data-name="ant-design:logout-outlined">
        <div className="absolute inset-[8.01%_6.25%_8.01%_8.01%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.1502 22.6758">
            <path d={svgPaths.p30b1ce00} fill="var(--fill-0, black)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Stat({ className }: { className?: string }) {
  return (
    <div className={className || "-translate-x-1/2 absolute bg-[#e7efe9] h-[106px] left-[calc(50%+0.5px)] top-[39px] w-[986px]"} data-name="STAT">
      <div className="absolute bg-white inset-[0_76.38%_0_0] rounded-[10px]">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-[-1px] pointer-events-none rounded-[11px]" />
      </div>
      <div className="absolute bg-white inset-[0_50.92%_0_25.46%] rounded-[10px]">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-[-1px] pointer-events-none rounded-[11px]" />
      </div>
      <div className="absolute bg-white inset-[0_25.46%_0_50.92%] rounded-[10px]">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-[-1px] pointer-events-none rounded-[11px]" />
      </div>
      <div className="absolute bg-white inset-[0_0_0_76.38%] rounded-[10px]">
        <div aria-hidden="true" className="absolute border border-solid border-white inset-[-1px] pointer-events-none rounded-[11px]" />
      </div>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[10.38%_77.66%_74.53%_1.15%] leading-[22px] text-[#1a6b58] text-[20px]">REGISTERED FARM</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[10.38%_56.66%_74.53%_26.61%] leading-[22px] text-[#1a6b58] text-[20px]">ASSESSED (FY)</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[10.38%_35.06%_74.53%_52.06%] leading-[22px] text-[#1a6b58] text-[20px]">COMPLIANT</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[10.38%_11.93%_74.53%_77.52%] leading-[22px] text-[#1a6b58] text-[20px]">ACTIVE NC</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[42.45%_87.67%_42.45%_1.07%] leading-[22px] text-[#0b1f1a] text-[36px]">1,284</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[42.45%_65.15%_42.45%_26.53%] leading-[22px] text-[#0b1f1a] text-[36px]">991</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[42.45%_40%_42.45%_51.99%] leading-[22px] text-[#1a6b58] text-[36px]">612</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[42.45%_15.35%_42.45%_77.45%] leading-[22px] text-[#c2410c] text-[36px]">108</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[73.58%_82.2%_11.32%_1.07%] leading-[22px] text-[#1a6b58] text-[20px]">+24 This Month</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[73.58%_58.36%_11.32%_26.53%] leading-[22px] text-[#1a6b58] text-[20px]">71.5% coverage</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[73.58%_38.99%_11.32%_51.99%] leading-[22px] text-[#1a6b58] text-[20px]">66.6%</p>
      <p className="absolute font-['Manrope:Bold',sans-serif] font-bold inset-[73.58%_10.48%_11.32%_77.45%] leading-[22px] text-[#1a6b58] text-[20px]">14 overdue</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="absolute bg-[#e7efe9] h-[1024px] left-0 overflow-clip top-0 w-[1025px]" data-name="Dashboard">
      <Stat />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[1024px] left-[415px] top-0 w-[1025px]">
      <Dashboard />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <Desktop />
      <Frame />
    </div>
  );
}