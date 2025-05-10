import { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Button, 
  Collapse, 
  IconButton, 
  useMediaQuery, 
  useTheme,
  Chip,
  Box,
  Typography
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  ExpandLess,
  Search,
  Work,
  Schedule,
  People,
  CheckCircle
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappIcon from '@/components/whatsappIcon';
import MetaLayout from '@/components/metalayout';
import FilterPageComponent from '@/components/FilterPageComponent';
import { 
  setInfo, 
  setInfo2, 
  setInfo3 
} from '@/redux/actions/main';
import { 
  getfp_for_cat, 
  getfp_for_time, 
  getfp_for_gender 
} from '@/redux/actions/list';

const FILTER_TYPES = {
  CATEGORY: {
    key: 'category',
    title: 'What kind of Helper do you need?',
    icon: Work,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Select the main job role. You can train a good candidate on supplementary skills.',
    bottomText: 'Select up to 3 categories that best describe the help you need.'
  },
  TIMING: {
    key: 'timing',
    title: 'What work timing are you looking for?',
    icon: Schedule,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Salary depends on timings. Be flexible for odd or long hours.',
    bottomText: 'Salary depends in a big way on timings. If you need someone at odd hours, or for long hours, be flexible in other negotiations.'
  },
  GENDER: {
    key: 'gender',
    title: 'What should be the gender of your Helper?',
    icon: People,
    iconColor: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: 'Consider your specific needs when selecting gender preference.',
    bottomText: 'Why hire a male domestic worker? This is because they can take care of outside work also. Sometimes they can double up as drivers and also do heavy work. Usually they also demand lesser salaries than females.'
  }
};

const CombinedFiltersPage = ({
  work_category,
  work_timing,
  gender,
  setInfo,
  setInfo2,
  setInfo3,
  location,
  filter_work_category,
  filter_work_timing,
  filter_gender,
  filter_distance,
  filter_locationscope,
  fp,
  gen_load,
  time_load
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [expanded, setExpanded] = useState({
    category: false,
    timing: false,
    gender: false
  });

  // Refs for each filter section
  const categoryRef = useRef(null);
  const timingRef = useRef(null);
  const genderRef = useRef(null);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expanded.category && categoryRef.current && !categoryRef.current.contains(event.target)) {
        setExpanded(prev => ({ ...prev, category: false }));
      }
      if (expanded.timing && timingRef.current && !timingRef.current.contains(event.target)) {
        setExpanded(prev => ({ ...prev, timing: false }));
      }
      if (expanded.gender && genderRef.current && !genderRef.current.contains(event.target)) {
        setExpanded(prev => ({ ...prev, gender: false }));
      }
    };

    // Add event listener when any dropdown is open
    if (expanded.category || expanded.timing || expanded.gender) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  useEffect(() => {
    if (work_category.length === 0) setInfo();
    if (work_timing.length === 0) setInfo2();
    if (gender.length === 0) setInfo3();

    const data = {
      cat: filter_work_category.map(item => item.id),
      time: filter_work_timing?.id || '',
      gender: filter_gender?.id || '',
      area: location.areaid,
      dynamiclat: location.dynamiclat,
      dynamiclng: location.dynamiclng,
      distancerange: filter_distance?.id,
      locationscope: filter_locationscope?.id,
    };

    if (filter_work_category.length > 0) {
      if (!filter_work_timing?.id && !filter_gender?.id) {
        dispatch(getfp_for_cat(data));
      } else if (filter_work_timing?.id && !filter_gender?.id) {
        dispatch(getfp_for_time(data));
      } else if (filter_work_timing?.id && filter_gender?.id) {
        dispatch(getfp_for_gender(data));
      }
    }
  }, [
    dispatch, 
    location, 
    setInfo, 
    setInfo2, 
    setInfo3, 
    work_category.length, 
    work_timing.length, 
    gender.length,
    filter_work_category,
    filter_work_timing,
    filter_gender
  ]);

  const handleFindHelpers = () => {
    router.push("/helpers");
  };

  const toggleSection = (section) => {
    setExpanded(prev => {
      const newState = { category: false, timing: false, gender: false };
      newState[section] = !prev[section];
      return newState;
    });
  };

  const isComplete = filter_work_category.length > 0 && filter_work_timing && filter_gender;
  const totalCount = fp?.Totalcount || 0;
  
  const FilterSection = ({ filterType }) => {
    const { key, title, icon: Icon, iconColor, bgColor, description, bottomText } = filterType;
    const categories = key === 'category' ? work_category : 
                      key === 'timing' ? work_timing : gender;
    const selectedItem = key === 'category' ? filter_work_category : 
                        key === 'timing' ? filter_work_timing : filter_gender;
    const isExpanded = expanded[key];
    const sectionRef = key === 'category' ? categoryRef : 
                      key === 'timing' ? timingRef : genderRef;

    return (
      <Box 
        ref={sectionRef}
        sx={{ 
          mb: 2,
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 2
          }
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            backgroundColor: isExpanded ? 'primary.light' : 'background.paper',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            minHeight: '48px'
          }}
          onClick={() => toggleSection(key)}
        >
          <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
            <Box 
              sx={{
                p: 0.5,
                borderRadius: 0.5,
                backgroundColor: bgColor.replace('bg-', ''),
                color: iconColor.replace('text-', ''),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {title}
            </Typography>
            {selectedItem && (
              <Box ml={1}>
                {key === 'category' ? (
                  <Chip 
                    label={`${selectedItem.length} selected`}
                    size="small"
                    color="primary"
                    sx={{ height: '24px' }}
                  />
                ) : (
                  <Chip 
                    label={selectedItem.name}
                    size="small"
                    color="success"
                    icon={<CheckCircle fontSize="small" />}
                    sx={{ height: '24px' }}
                  />
                )}
              </Box>
            )}
          </Box>
          <IconButton size="small" sx={{ p: 0.5 }}>
            {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Box p={1} bgcolor="background.paper">
            <FilterPageComponent
              categories={categories}
              type={key}
              selectedItem={selectedItem}
              description={description}
              bottomtext={[bottomText]}
              compact
              sx={{
                '& .MuiButton-root': {
                  minHeight: '32px',
                  padding: '4px 8px',
                  fontSize: '0.75rem'
                },
                '& .MuiTypography-body1': {
                  fontSize: '0.8rem'
                }
              }}
            />
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <>
      <Header />
      <MetaLayout>
        <link rel="canonical" href="https://helper4u.in/" />
        <title>Select Helper Preferences | Helper4U</title>
        <meta name="description" content="Choose your preferred helper category, work timing and gender" />
      </MetaLayout>

      <Box sx={{ 
        minHeight: '70vh',
        background: 'linear-gradient(to bottom right, #f0f4ff, #f8f9ff)',
        p: isMobile ? 1 : 2
      }}>
        <Box sx={{
          maxWidth: 'md',
          mx: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 2
        }}>
          {/* Header Section */}
          <Box sx={{
            p: isMobile ? 1.5 : 2,
            background: 'linear-gradient(to right, #4f46e5, #6366f1)',
            color: 'common.white'
          }}>
            <Link href="/" passHref>
              <Button 
                startIcon={<ArrowBack fontSize="small" />}
                variant="outlined"
                size="small"
                sx={{
                  color: 'common.white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  mb: 1,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  padding: '4px 8px',
                  minHeight: '32px'
                }}
              >
                Back to Home
              </Button>
            </Link>
            
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Work fontSize="small" />
              <Typography variant="h6" fontWeight="bold">
                Find Your Perfect Helper
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: isMobile ? 1 : 2 }}>
            {/* Filter Sections */}
            <Box mb={2}>
              {Object.values(FILTER_TYPES).map((filterType) => (
                <FilterSection 
                  key={filterType.key}
                  filterType={filterType}
                />
              ))}
            </Box>

            {/* Find Helpers Button */}
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleFindHelpers}
                disabled={!isComplete}
                fullWidth
                startIcon={<Search fontSize="small" />}
                sx={{
                  py: 1,
                  fontWeight: 'bold',
                  boxShadow: 1,
                  fontSize: '0.875rem',
                  '&:hover': {
                    boxShadow: 2,
                    transform: 'translateY(-1px)'
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500'
                  }
                }}
              >
                {isComplete ? `Find ${totalCount} Helpers` : 'Complete Selections to Find Helpers'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <WhatsappIcon />
      <Footer />
    </>
  );
};

export default connect(
  (state) => ({
    work_category: state.main.work_category,
    work_timing: state.main.work_timing,
    gender: state.main.gender,
    location: state.filter.location,
    filter_work_category: state.filter.filter_work_category,
    filter_work_timing: state.filter.filter_work_timing,
    filter_gender: state.filter.filter_gender,
    filter_distance: state.filter.filter_distance,
    filter_locationscope: state.filter.filter_locationscope,
    fp: state.list.featuredprofile_gender || state.list.featuredprofile_time || state.list.featuredprofile_cat,
    gen_load: state.list.loading_gender,
    time_load: state.list.loading_time
  }),
  { setInfo, setInfo2, setInfo3, getfp_for_cat, getfp_for_time, getfp_for_gender }
)(CombinedFiltersPage);